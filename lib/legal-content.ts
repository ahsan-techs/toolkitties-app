import { CONTACT_EMAIL, SITE_NAME, SITE_URL } from "./site-config";

export type LegalSection = {
  id: string;
  title: string;
  paragraphs?: string[];
  bullets?: string[];
  closing?: string[];
};

export const privacySections: LegalSection[] = [
  {
    id: "summary",
    title: "The short version",
    paragraphs: [
      `${SITE_NAME} is a set of free online tools. Most of them work entirely inside your web browser, so the files you open, convert or edit stay on your own device.`,
    ],
    bullets: [
      "We do not ask you to create an account, and we do not ask for your name, phone number or payment details.",
      "Files you use in our tools are processed in your browser. They are not uploaded to our servers.",
      "We do not use advertising or analytics tools at the moment, and we do not set tracking cookies.",
      "If you choose to send us a message, we receive the email address and the text you decide to send.",
    ],
  },
  {
    id: "who-we-are",
    title: "Who we are",
    paragraphs: [
      `${SITE_NAME} (${SITE_URL}) is a free website of everyday file, text, image, developer and calculator tools. In this policy, "we", "us" and "our" mean the operator of ${SITE_NAME}.`,
      `You can reach us at ${CONTACT_EMAIL} or through the contact page at ${SITE_URL}/contact.`,
    ],
  },
  {
    id: "your-files",
    title: "Your files and the things you type into tools",
    paragraphs: [
      "When you drop a PDF, image or document into one of our tools, your browser reads and processes it on your own device. The finished file is created in your browser too, and you download it directly from there.",
      "This means we cannot see your files, we do not keep copies, and we cannot recover them for you. When you close or refresh the page, the files and results in that tab are gone.",
      "The same applies to text you type or paste into text, developer and calculator tools, such as the JSON Formatter, Word Counter or Loan Calculator.",
      "Some tools load helper files from our own website so they can work, for example the PDF reader files used to show PDF pages. These are code files, not your content.",
    ],
  },
  {
    id: "information-we-collect",
    title: "Information we collect",
    paragraphs: ["We keep the amount of information we handle small. It falls into two groups."],
    bullets: [
      "Messages you send us. If you write to us or use the feedback form, you send an email from your own email program. We receive your email address and everything you put in the message. Please do not attach private or confidential files.",
      "Technical information from our hosting provider. Like almost every website, our host records basic information when a page is requested: your IP address, the date and time, the page requested, and details such as your browser type and device. This is used to deliver the site and keep it secure.",
    ],
  },
  {
    id: "cookies-and-storage",
    title: "Cookies and local storage",
    paragraphs: [
      "We do not use cookies to track you or to build a profile about you.",
      "A few tools save small preferences in your browser's local storage so the page looks the way you left it, for example whether the side menu is open or which colour theme the Invoice Generator uses. This information stays on your device. We do not receive it, and you can remove it at any time by clearing your browser's site data.",
    ],
  },
  {
    id: "third-parties",
    title: "Third-party services",
    paragraphs: ["The following outside services are involved when you use the site:"],
    bullets: [
      "Vercel hosts the website and delivers its pages. It processes technical request information such as IP addresses as part of hosting.",
      "Google Fonts supplies the fonts used on the site. When a page loads, your browser requests the font files from Google, which means Google can receive your IP address and browser information in the normal way.",
      "Exchange-rate service. The Invoice Generator asks a public exchange-rate service (open.er-api.com) for current currency rates. That request contains no invoice details and no personal information.",
    ],
    closing: [
      "These providers have their own privacy policies. We do not sell your information to anyone.",
    ],
  },
  {
    id: "advertising",
    title: "Advertising and analytics",
    paragraphs: [
      "At the moment the site shows no advertising and runs no analytics or tracking scripts.",
      "If we add advertising or analytics in the future, we will update this policy before they start. The update will explain what is collected, which companies are involved, and how you can opt out.",
    ],
  },
  {
    id: "how-we-use",
    title: "How we use information",
    bullets: [
      "To run the website and keep it fast, stable and secure.",
      "To read and answer the messages and feedback you send us.",
      "To find and fix broken tools and to decide which tools to improve or add.",
      "To follow the law and protect the site against abuse.",
    ],
  },
  {
    id: "legal-basis",
    title: "Legal basis for using information (EEA, UK and similar regions)",
    paragraphs: [
      "Where data protection laws such as the GDPR apply, we rely on our legitimate interest in operating and securing a free website, and on your choice to contact us when you send a message. We process your message only to respond to it.",
    ],
  },
  {
    id: "retention",
    title: "How long we keep information",
    paragraphs: [
      "Messages are kept for as long as we need them to answer you and to track down and fix the problem you reported, and then they are deleted. Hosting logs are kept by our hosting provider for the period set out in its own policy.",
      "Files and text you use in our tools are not kept by us at all, because they never reach our servers.",
    ],
  },
  {
    id: "your-rights",
    title: "Your rights",
    paragraphs: [
      "Depending on where you live, you may have the right to ask what personal information we hold about you, to have it corrected or deleted, to object to how it is used, and to complain to your local data protection authority.",
      `To use any of these rights, email us at ${CONTACT_EMAIL}. We will reply as soon as we reasonably can.`,
    ],
  },
  {
    id: "children",
    title: "Children's privacy",
    paragraphs: [
      `${SITE_NAME} is a general-purpose tool site and is not directed at children under 13. We do not knowingly collect personal information from children. If you believe a child has sent us personal information, please contact us and we will delete it.`,
    ],
  },
  {
    id: "international",
    title: "International visitors",
    paragraphs: [
      "Our hosting provider may deliver the site from servers in different countries so that pages load quickly for you. By using the site you understand that technical request information may be handled in countries other than your own.",
    ],
  },
  {
    id: "security",
    title: "Security",
    paragraphs: [
      "The whole site is served over an encrypted HTTPS connection, and we add standard browser security headers to help protect visitors. Because your files are processed on your own device, they are not exposed to our servers or to other visitors.",
      "No website can promise perfect security, so please keep your device and browser up to date and be careful with sensitive documents on shared computers.",
    ],
  },
  {
    id: "changes",
    title: "Changes to this policy",
    paragraphs: [
      `We may update this policy from time to time. When we do, we will change the "Last updated" date at the top of this page. If a change is significant, we will make it clear on the site.`,
    ],
  },
  {
    id: "contact",
    title: "Contact us",
    paragraphs: [
      `Questions about this policy? Email ${CONTACT_EMAIL} or use the contact page at ${SITE_URL}/contact.`,
    ],
  },
];

export const termsSections: LegalSection[] = [
  {
    id: "agreement",
    title: "Agreeing to these terms",
    paragraphs: [
      `These terms explain the rules for using ${SITE_NAME} (${SITE_URL}). By opening or using the website, you agree to them. If you do not agree, please do not use the site.`,
      "Please also read our Privacy Policy, which explains how information is handled.",
    ],
  },
  {
    id: "the-service",
    title: "What the service is",
    paragraphs: [
      `${SITE_NAME} offers free online tools for working with PDFs, images, text, data and everyday calculations. The tools run in your web browser. There is no account to create and no fee to pay.`,
      "We may add, change, improve or remove tools and features at any time, with or without notice, and we may pause the site for maintenance.",
    ],
  },
  {
    id: "your-files",
    title: "Your files and your responsibility",
    paragraphs: [
      "Your files stay yours. We do not claim any rights over the files, text or results you create with our tools.",
      "You are responsible for what you process. By using a tool, you confirm that:",
    ],
    bullets: [
      "you own the file or have the right and permission to use it in this way;",
      "you will not use the tools on material that is illegal or that infringes someone else's rights;",
      "when you unlock or remove the password from a PDF, you are allowed to access it and already have its password.",
    ],
    closing: [
      "Because processing happens on your device, we cannot restore a lost or damaged file. Always keep a copy of your original files.",
    ],
  },
  {
    id: "acceptable-use",
    title: "Acceptable use",
    paragraphs: ["Please use the site fairly. You agree not to:"],
    bullets: [
      "use the site for anything unlawful, harmful, fraudulent or abusive;",
      "try to break, overload or disrupt the website or its hosting, or bypass its security;",
      "use automated systems to send excessive requests to the site;",
      "copy the site's design, text or branding and present it as your own, or pretend to be us;",
      "use the tools to create documents intended to deceive people, such as forged invoices or false records.",
    ],
  },
  {
    id: "accuracy",
    title: "Results, accuracy and professional advice",
    paragraphs: [
      "We work to make the tools accurate and dependable, but results can depend on your file and your device. For example, a converted document may look different from the original, and some tools have limits (PDF to Word, for instance, extracts text only).",
      "Please check every result before you rely on it or send it to someone else.",
      "The calculators, generators and checkers on the site, including the Loan / EMI Calculator, BMI Calculator, Percentage Calculator and Invoice Generator, give general information only. They are not financial, tax, legal or medical advice. Speak to a qualified professional before making important decisions.",
    ],
  },
  {
    id: "intellectual-property",
    title: "Our content and intellectual property",
    paragraphs: [
      `The ${SITE_NAME} name, logo, website design, text and code belong to us or our licensors and are protected by applicable law. Open-source components used on the site remain under their own licences.`,
      "You may use the site for your personal or business needs. You may not copy, resell or redistribute the website itself without our written permission.",
    ],
  },
  {
    id: "links",
    title: "Links to other websites",
    paragraphs: [
      "The site may link to outside websites. We do not control them and are not responsible for their content or privacy practices.",
    ],
  },
  {
    id: "disclaimer",
    title: "No warranty",
    paragraphs: [
      `${SITE_NAME} is provided "as is" and "as available", without promises of any kind, either express or implied. We do not guarantee that the site will always be available, error-free, secure or suitable for a particular purpose.`,
    ],
  },
  {
    id: "liability",
    title: "Limit of liability",
    paragraphs: [
      "To the fullest extent allowed by law, we are not liable for any indirect, incidental, special or consequential loss, or for loss of data, files, profits or business, arising from your use of, or inability to use, the site or its tools.",
      "Because the service is free, our total liability for any claim connected with it is limited to the maximum extent the law permits. Nothing in these terms limits any right you have that cannot lawfully be limited.",
    ],
  },
  {
    id: "indemnity",
    title: "Your responsibility for misuse",
    paragraphs: [
      "If your misuse of the site or your breach of these terms causes a claim or loss for us, you agree to be responsible for it to the extent the law allows.",
    ],
  },
  {
    id: "changes",
    title: "Changes to the site and these terms",
    paragraphs: [
      `We may update these terms from time to time. The "Last updated" date at the top shows when they last changed. If you keep using the site after an update, you accept the new terms.`,
      "We may also suspend or block access to anyone who breaks these terms.",
    ],
  },
  {
    id: "law",
    title: "Governing law",
    paragraphs: [
      "These terms are governed by the laws that apply where the operator of the site is based, without regard to conflict-of-law rules. Any dispute will be handled by the courts that have jurisdiction there, unless local consumer law gives you the right to go elsewhere.",
    ],
  },
  {
    id: "contact",
    title: "Contact us",
    paragraphs: [`Questions about these terms? Email ${CONTACT_EMAIL} or use ${SITE_URL}/contact.`],
  },
];
