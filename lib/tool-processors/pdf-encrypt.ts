import {
  PDFArray,
  PDFDict,
  PDFDocument,
  PDFHexString,
  PDFName,
  PDFObject,
  PDFRawStream,
  PDFStream,
  PDFString,
} from "pdf-lib";

// Password-protects a PDF with AES-256 (PDF 2.0 "R6" standard security handler), using the
// browser's built-in Web Crypto. Works on a document loaded with pdf-lib.

const buf = (u: Uint8Array) => u as unknown as BufferSource;
const ZERO_IV = new Uint8Array(16);

const random = (n: number) => crypto.getRandomValues(new Uint8Array(n));
const toHex = (b: Uint8Array) => Array.from(b, (x) => x.toString(16).padStart(2, "0")).join("");

function concat(...parts: Uint8Array[]): Uint8Array {
  const out = new Uint8Array(parts.reduce((s, p) => s + p.length, 0));
  let pos = 0;
  for (const p of parts) {
    out.set(p, pos);
    pos += p.length;
  }
  return out;
}

// AES-CBC without padding: WebCrypto always pads, so the extra last block is dropped.
async function aesCbcNoPad(key: Uint8Array, iv: Uint8Array, data: Uint8Array): Promise<Uint8Array> {
  const k = await crypto.subtle.importKey("raw", buf(key), "AES-CBC", false, ["encrypt"]);
  const out = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-CBC", iv: buf(iv) }, k, buf(data)));
  return out.slice(0, data.length);
}

async function sha(bits: 256 | 384 | 512, data: Uint8Array): Promise<Uint8Array> {
  return new Uint8Array(await crypto.subtle.digest(`SHA-${bits}`, buf(data)));
}

// ISO 32000-2, algorithm 2.B
async function hash2B(password: Uint8Array, salt: Uint8Array, udata: Uint8Array): Promise<Uint8Array> {
  let k = await sha(256, concat(password, salt, udata));
  let e: Uint8Array = new Uint8Array(1);
  for (let i = 0; i < 64 || e[e.length - 1] > i - 32; i++) {
    const unit = concat(password, k, udata);
    const k1 = new Uint8Array(unit.length * 64);
    for (let j = 0; j < 64; j++) k1.set(unit, j * unit.length);
    e = await aesCbcNoPad(k.slice(0, 16), k.slice(16, 32), k1);
    let sum = 0;
    for (let j = 0; j < 16; j++) sum += e[j];
    const bits = [256, 384, 512][sum % 3] as 256 | 384 | 512;
    k = await sha(bits, e);
  }
  return k.slice(0, 32);
}

export async function encryptPdfDocument(pdfDoc: PDFDocument, password: string): Promise<void> {
  const context = pdfDoc.context;
  const pw = new TextEncoder().encode(password).slice(0, 127);
  const fileKey = random(32);
  const empty = new Uint8Array(0);

  // User and owner entries (same password for both: it is needed to open the file).
  const uValSalt = random(8);
  const uKeySalt = random(8);
  const U = concat(await hash2B(pw, uValSalt, empty), uValSalt, uKeySalt);
  const UE = await aesCbcNoPad(await hash2B(pw, uKeySalt, empty), ZERO_IV, fileKey);
  const oValSalt = random(8);
  const oKeySalt = random(8);
  const O = concat(await hash2B(pw, oValSalt, U), oValSalt, oKeySalt);
  const OE = await aesCbcNoPad(await hash2B(pw, oKeySalt, U), ZERO_IV, fileKey);

  const perms = new Uint8Array(16);
  perms.set([0xfc, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0x54, 0x61, 0x64, 0x62], 0); // P=-4, "T", "adb"
  perms.set(random(4), 12);
  const Perms = await aesCbcNoPad(fileKey, ZERO_IV, perms);

  // Encrypt every string and stream with the file key (AES-256-CBC, random IV in front).
  const key = await crypto.subtle.importKey("raw", buf(fileKey), "AES-CBC", false, ["encrypt"]);
  const encrypt = async (data: Uint8Array) => {
    const iv = random(16);
    const ct = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-CBC", iv: buf(iv) }, key, buf(data)));
    return concat(iv, ct);
  };
  const encryptValue = async (v: PDFObject): Promise<PDFObject> => {
    if (v instanceof PDFString || v instanceof PDFHexString) return PDFHexString.of(toHex(await encrypt(v.asBytes())));
    if (v instanceof PDFDict) await encryptDict(v);
    else if (v instanceof PDFArray) await encryptArray(v);
    return v;
  };
  const encryptDict = async (d: PDFDict) => {
    for (const [name, value] of d.entries()) d.set(name, await encryptValue(value));
  };
  const encryptArray = async (a: PDFArray) => {
    for (let i = 0; i < a.size(); i++) a.set(i, await encryptValue(a.get(i)));
  };

  for (const [ref, obj] of context.enumerateIndirectObjects()) {
    if (obj instanceof PDFStream) {
      const type = obj.dict.get(PDFName.of("Type"));
      if (type === PDFName.of("XRef")) continue;
      await encryptDict(obj.dict);
      context.assign(ref, PDFRawStream.of(obj.dict, await encrypt(obj.getContents())));
    } else if (obj instanceof PDFDict || obj instanceof PDFArray) {
      await encryptValue(obj);
    } else if (obj instanceof PDFString || obj instanceof PDFHexString) {
      context.assign(ref, await encryptValue(obj));
    }
  }

  const encryptRef = context.register(
    context.obj({
      Filter: "Standard",
      V: 5,
      R: 6,
      Length: 256,
      CF: { StdCF: { AuthEvent: "DocOpen", CFM: "AESV3", Length: 32 } },
      StmF: "StdCF",
      StrF: "StdCF",
      O: PDFHexString.of(toHex(O)),
      U: PDFHexString.of(toHex(U)),
      OE: PDFHexString.of(toHex(OE)),
      UE: PDFHexString.of(toHex(UE)),
      Perms: PDFHexString.of(toHex(Perms)),
      P: -4,
      EncryptMetadata: true,
    })
  );
  context.trailerInfo.Encrypt = encryptRef;
  context.trailerInfo.ID = context.obj([PDFHexString.of(toHex(random(16))), PDFHexString.of(toHex(random(16)))]);
}
