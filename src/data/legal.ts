export type LegalDoc = {
  slug: 'terms' | 'privacy' | 'cookies' | 'acceptable-use';
  title: string;
  updated: string;
  intro: string;
  sections: { heading: string; body: string[] }[];
};

export const legalDocs: LegalDoc[] = [
  {
    slug: 'terms',
    title: 'Terms of Service',
    updated: '7/20/2026',
    intro:
      'By accessing or using Soteria ("Soteria", "we", "our", or "us") at soteria.rip, including the obfuscation service, the whitelist and key system, any related tools, and the application programming interface (API) (collectively, the "Service"), you agree to be bound by these Terms of Service. If you do not agree with any part of these Terms, you must not access or use the Service. Accessing or using the Service through the API, automated scripts, or any programmatic means constitutes acceptance of these Terms to the same extent as accessing the website directly.',
    sections: [
      {
        heading: '1. Acceptance of Terms',
        body: [
          'You must be at least 13 years old to use the Service, or the minimum age of digital consent in your country if higher. If you are under 18, you may only use the Service with the permission of a parent or legal guardian who agrees to these Terms on your behalf. By permitting a minor to use the Service, the parent or legal guardian agrees to be personally bound by these Terms, accepts full responsibility for the minor\'s use of the Service, and agrees to be liable for any violations of these Terms by the minor, including all financial obligations, indemnification, and waiver of claims set forth herein.',
        ],
      },
      {
        heading: '2. What Soteria Is and Is Not',
        body: [
          'Soteria provides code obfuscation tooling for Luau and Lua scripts, along with a key and whitelist system that script authors can use to license and gate access to their own work. Soteria is a tool. We do not write, review, endorse, or take responsibility for the content, purpose, or function of any script submitted to the Service.',
          'Soteria is not a publisher or distributor of the scripts you obfuscate, and is not a party to any agreement between you and the end users of your scripts. You are solely responsible for what you upload, what it does, and how you distribute it.',
          'Soteria is an independent service. We have no affiliation, association, partnership, or official connection of any kind with Roblox Corporation, Byfron Technologies, or any of their respective subsidiaries, affiliates, or partners. The Soteria platform is not endorsed, sponsored, or approved by Roblox Corporation or Byfron Technologies. Any references to Roblox, Luau, or related technologies are made solely for descriptive purposes and do not imply any relationship.',
          'Soteria does not support, condone, encourage, or endorse exploiting, hacking, cheating, or any form of unauthorized modification of Roblox or any other platform. We do not support or condone the bypassing, circumvention, reverse engineering, or disabling of any anti-cheat, anti-tamper, or security system. While our tools may be technically compatible with third-party execution environments, compatibility does not constitute endorsement. The Service is intended for legitimate use cases such as protecting your own intellectual property, licensing your own scripts, and decompiling code you have the right to analyze.',
          'Soteria respects the intellectual property and security interests of third-party platforms. If you are a rights holder or authorized representative and believe that content or activity on the Service infringes your rights, you may submit a written request to legal@soteria.rip. We will review all good-faith requests in a timely manner.',
        ],
      },
      {
        heading: '3. Oracle Data Collection, Service Creator Access, and the Discord Bot',
        body: [
          'The Oracle whitelist and key system collects certain data from end users when scripts are executed. This data may include User IDs, Hardware IDs (HWIDs), approximate geolocation (country, derived from IP address), device type, executor type, and Roblox profile information. This data is collected to enforce access controls, prevent abuse, and operate the key system.',
          'Oracle service creators may enable webhook logging for their services. When enabled, execution data, security events, and errors are sent to a Discord webhook URL configured by the service creator. Service creators can also view HWIDs and User IDs associated with keys in their service through the Soteria dashboard.',
          'Soteria acts solely as a platform and tool provider. Once data is delivered to a service creator via webhook logs, the dashboard, or any other feature of the Service, Soteria has no control over and assumes no responsibility for how that service creator stores, uses, processes, shares, discloses, or otherwise handles that data. Service creators are independent third parties.',
          'If you are an Oracle service creator, you are solely responsible for your own compliance with all applicable laws and regulations regarding the data you receive through the Service, including data protection, privacy, and consumer protection laws. You agree to indemnify Soteria against any claims arising from your handling of end-user data.',
          'The Service may display estimated revenue figures to Oracle service creators based on gateway checkpoint completions and estimated CPM rates. These figures are approximations only and are not guaranteed, verified, or auditable.',
          'Soteria provides an optional Discord bot that lets you link a Discord server to your Oracle service. Using the bot\'s /manager command, you may grant any Discord role the ability to use staff commands on your behalf. You are solely responsible for who you grant this access to and for any action taken through your linked server.',
        ],
      },
      {
        heading: '4. Acceptable Use',
        body: [
          'You agree to use the Service only for lawful purposes. You must not upload, obfuscate, distribute, or otherwise process any script that contains malware, stealers, info loggers, keyloggers, or any code designed to damage, disable, disrupt, or gain unauthorized access to any system, device, or account.',
          'You must not use the Service to conceal or disguise code that violates the terms of service, anti-cheat systems, or intellectual property rights of any third-party platform. You must not upload or obfuscate any script you do not own or do not have the legal right to modify, obfuscate, or distribute.',
          'You must not reverse engineer, decompile, deobfuscate, or attempt to derive the source code, algorithms, or underlying structure of the Service, our obfuscator, or our key system. You must not attempt to bypass, weaken, or circumvent any security, licensing, or technical protection measure used by the Service.',
        ],
      },
      {
        heading: '5. Accounts',
        body: [
          'You are responsible for safeguarding your account credentials and for any activity conducted under your account. You agree to notify us immediately of any unauthorized use of your account. We may suspend or terminate accounts that violate these Terms or that we determine, in our sole discretion, pose a risk to the Service or other users.',
          'You may not create multiple accounts to evade bans, suspensions, rate limits, or any other restrictions. You may not use disposable or temporary email addresses to register or maintain an account.',
        ],
      },
      {
        heading: '6. Payments, Tokens, and Memberships',
        body: [
          'Payments are processed securely via Stripe. We do not store your card details on our servers. Your Stripe customer ID is stored in your account record. All sales are final and non-refundable.',
          'Token-based plans provide a fixed number of obfuscation tokens that do not expire. Membership plans (Plus, Pro, Max) include a monthly obfuscation quota that resets each billing cycle. Unused quota does not roll over.',
          'We reserve the right to change pricing at any time. Price changes take effect at the start of your next billing cycle.',
        ],
      },
      {
        heading: '7. Account Suspension and Termination',
        body: [
          'We reserve the right to suspend, restrict, or terminate your account at any time, with or without cause or notice, if we believe you have violated these Terms, the Acceptable Use Policy, or applicable law. Upon termination, all tokens, memberships, and keys associated with your account may be forfeited without refund.',
        ],
      },
      {
        heading: '8. Limitations on Use',
        body: [
          'You must not use bots, scrapers, or automated means to interact with the Service except through our official API. You must not send excessive requests or take any action intended to disrupt, degrade, or impair the performance of the Service. You must not probe, scan, or test for vulnerabilities in the Service.',
        ],
      },
      {
        heading: '9. Disclaimer of Warranties',
        body: [
          'The Service is provided on an "as is" and "as available" basis without warranties of any kind, either express or implied. We do not warrant that the Service will be uninterrupted, error-free, secure, or free of harmful components, or that obfuscated output will be undetectable by any particular system, anti-cheat, or third party.',
          'Soteria does not guarantee that obfuscated code will be impossible to reverse engineer, deobfuscate, reconstruct, or otherwise recover in any form. Obfuscation is a deterrent, not an absolute security guarantee. Similarly, the Oracle whitelist and key system is provided as a tool to help manage access, but we do not warrant that it will prevent all unauthorized use, bypass, or circumvention.',
        ],
      },
      {
        heading: '10. Intellectual Property',
        body: [
          'The Service, including the obfuscator, Oracle, Genesis, the website, and all associated software, documentation, and branding, is the intellectual property of Soteria. The obfuscated output produced by the Service contains proprietary transformations that are the intellectual property of Soteria. You may not reverse engineer, decompile, or deobfuscate any output produced by the Service.',
        ],
      },
      {
        heading: '11. Copyright Infringement and DMCA',
        body: [
          'We respect intellectual property rights and expect our users to do the same. If you believe that content on the Service infringes your copyright, you may submit a DMCA notice to legal@soteria.rip. We will review and respond to all valid notices in accordance with applicable law.',
        ],
      },
      {
        heading: '12. Limitation of Liability',
        body: [
          'To the maximum extent permitted by applicable law, Soteria, its officers, directors, employees, agents, affiliates, and licensors shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, goodwill, business opportunity, or reputation, arising out of or in connection with your use of or inability to use the Service.',
          'In no event shall our total aggregate liability to you for all claims arising out of or relating to these Terms or the Service exceed the lesser of (a) the amount you paid us in the twelve (12) months preceding the claim, or (b) one hundred US dollars ($100).',
        ],
      },
      {
        heading: '13. Indemnification',
        body: [
          'If a third party brings a claim against Soteria because of something you did, including your use of the Service, any script you uploaded or obfuscated, a violation of these Terms, or a violation of the rights of any third party, you agree to indemnify, defend, and hold harmless Soteria from and against any and all resulting claims, liabilities, damages, losses, and expenses, including the cost of Soteria\'s legal defense.',
        ],
      },
      {
        heading: '14. Governing Law and Dispute Resolution',
        body: [
          'These Terms shall be governed by and construed in accordance with the laws of the State of California. Any dispute shall first be attempted to be resolved through good-faith informal negotiation. If the dispute cannot be resolved informally within thirty (30) days, it shall be resolved exclusively through binding individual arbitration, administered in accordance with the rules of the American Arbitration Association (AAA). The arbitration shall take place in San Francisco, California.',
        ],
      },
      {
        heading: '15. Class Action Waiver',
        body: [
          'To the fullest extent permitted by applicable law, you agree that any dispute resolution proceeding will be conducted only on an individual basis and not as a class, consolidated, or representative action. You expressly waive any right to participate in a class action lawsuit or class-wide arbitration against Soteria.',
        ],
      },
      {
        heading: '16. Changes to These Terms',
        body: [
          'We reserve the right to modify these Terms at any time, at our sole discretion and without prior notice. The "Last updated" date at the top of this page reflects the most recent revision. Your continued use of the Service after a revision is posted constitutes your acceptance of the new Terms.',
        ],
      },
      {
        heading: '17. Contact Us',
        body: ['If you have any questions about these Terms of Service, please contact us at legal@soteria.rip.'],
      },
    ],
  },
  {
    slug: 'privacy',
    title: 'Privacy Policy',
    updated: '7/24/2026',
    intro:
      'Welcome to Soteria. We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform located at soteria.rip, including our obfuscation service, our Oracle whitelist and key system, and our Genesis decompiler (together, the "Service"). Please read this policy carefully. If you disagree with its terms, please discontinue use of the Service.',
    sections: [
      {
        heading: '1. Information We Collect',
        body: [
          'We may collect the following types of information:',
          '- Account information such as your name, email address, and password. If you sign in using a third-party provider (such as Google or Discord), we receive and store your provider account name and email address.',
          '- Usage data including pages visited, features used, and time spent on the platform.',
          '- Cookies and similar tracking technologies to enhance your experience.',
          '- Payment information processed securely via Stripe. We do not store your card details on our servers. Your Stripe customer ID is stored in your account record.',
          '- Files you submit to the Service for obfuscation or decompilation, limited to plain text, Lua, and Luau script files.',
          '- Login and device information, including your IP address and your browser and operating system details, collected when you sign in and associated with your account to secure it and power session management.',
          '- If you enable two-factor authentication, an encrypted authenticator secret and one-time backup recovery codes, stored only in hashed form.',
          '- API keys generated for programmatic access to the Service, stored in your account record.',
          '- Email validation data. When you register, we validate your email address by checking your email domain\'s MX records and comparing them against known disposable, temporary, or suspicious email providers.',
          '- CAPTCHA verification data. We use Cloudflare Turnstile to protect forms against automated abuse.',
          '- Event logs generated by your activity on the platform, including obfuscating scripts, signing up, signing in, redeeming codes, generating or revoking keys, and other significant account actions.',
          '- Usage metrics, including daily obfuscation counts, script execution counts, decompilation counts, and key generation counts, tracked per user and globally for operational and analytics purposes.',
        ],
      },
      {
        heading: '2. Script, Oracle, and Gateway Data',
        body: [
          'When you use the obfuscator, Oracle, Genesis, or interact with a gateway, we collect certain data to operate, secure, and improve the Service. For scripts processed without a key, usage is logged anonymously — device type, executor type, and country (derived from IP, not stored).',
          'For scripts that require an Oracle key, additional identifiers are logged and associated with your key: User ID, Hardware ID (HWID), approximate geolocation, device type, executor type, and (only for gateway-generated keys) IP address. This data is retained for as long as the key remains active and is deleted when the key is deleted, revoked, or expires.',
          'Oracle service creators may enable webhook logging. When enabled, execution data, security events, and errors may be sent to a Discord webhook URL configured by the service creator. This data may include your Roblox profile link, approximate geolocation, device type, executor type, and the Oracle key used. Soteria does not control how service creators handle this data.',
        ],
      },
      {
        heading: '3. Discord Bot Integration',
        body: [
          'If you or an Oracle service creator links a Discord server to a Soteria account using our Discord bot, we store the Discord server (guild) ID, server name, server icon, which Oracle service the server is bound to, and which Discord roles have been granted access to staff commands.',
          'Your Soteria API key is transmitted once to our bot when you run /login and is stored only to identify your account. Generating a new API key from your dashboard immediately unlinks and logs out every Discord server previously linked to your account.',
        ],
      },
      {
        heading: '4. Gateway (Session & IP Logging)',
        body: [
          'During an active gateway flow, a temporary session is created that stores your IP address, a gateway identifier (GateId) associated with your device or browser, the script and service involved, checkpoint progress, and a session expiration time (30 minutes). Your IP address is stored for security purposes and is never shared with gateway authors or any third parties.',
          'When a gateway flow is completed and a key is generated, the GateId is associated with the generated key. The gateway session and its associated IP data are deleted once the gateway flow is completed or expires.',
        ],
      },
      {
        heading: '5. Uploaded Files',
        body: [
          'Scripts you upload for obfuscation through Soteria or decompilation through Genesis are held in memory only for the duration of processing and are not written to persistent storage. Once processing is complete and the result is returned to you, the uploaded file and any in-memory copy are deleted. We do not claim ownership of your uploaded files, and we do not retain a copy of them.',
        ],
      },
      {
        heading: '6. Third-Party Services',
        body: [
          'The Service uses third-party services to operate, including but not limited to: Stripe for payment processing; Cloudflare for content delivery, security, CAPTCHA verification, and analytics; third-party email delivery services; third-party hosting services for script and paste storage; Roblox Corporation APIs for retrieving publicly available avatar thumbnails; Google and Discord for OAuth authentication; Work.ink, Linkvertise, and LootLabs for gateway monetization; and third-party geolocation and intelligence services for IP and email lookups.',
          'We have no control over and assume no responsibility for the content, policies, practices, data retention, or security of any third-party service.',
        ],
      },
      {
        heading: '7. Data Retention',
        body: [
          'Account information is retained for as long as your account is active. Event logs are retained for as long as necessary to fulfill their security and operational purpose. Uploaded files are not retained beyond processing. Gateway session data and IP addresses are deleted when the gateway flow completes or expires. Oracle key-associated data is deleted when the key is deleted, revoked, or expires.',
        ],
      },
      {
        heading: '8. Your Rights',
        body: [
          'Depending on your location, you may have the right to access, correct, delete, or export your personal information. You may also have the right to object to or restrict certain processing. To exercise any of these rights, contact us at legal@soteria.rip.',
        ],
      },
      {
        heading: '9. Changes to This Policy',
        body: [
          'We may update this Privacy Policy from time to time, at our sole discretion and without prior notice. The "Last updated" date at the top of this page reflects the most recent revision. Your continued use of the Service after a revision is posted constitutes your acceptance of the updated policy.',
        ],
      },
      {
        heading: '10. Contact Us',
        body: ['If you have any questions about this Privacy Policy, please contact us at legal@soteria.rip.'],
      },
    ],
  },
  {
    slug: 'cookies',
    title: 'Cookie Policy',
    updated: '6/24/2026',
    intro:
      'Cookies are small text files that are placed on your device when you visit a website. They are widely used to make websites work more efficiently, provide a better user experience, and give site operators useful information. Soteria ("we", "our", or "us") uses cookies and similar technologies on soteria.rip (the "Service").',
    sections: [
      {
        heading: '1. Cookies We Use',
        body: [
          'We use the following categories of cookies:',
          '**Strictly Necessary Cookies** — These cookies are essential for the Service to function. They enable core features such as authentication, session management, and security. Without these cookies, the Service cannot operate as intended. You cannot opt out of strictly necessary cookies.',
          '**Functional Cookies** — These cookies allow the Service to remember choices you make and provide enhanced, personalized features. They include cookies that remember your interface preferences and store your selected configuration options within the obfuscator.',
          '**Third-Party Cookies** — The Service relies on third-party infrastructure and service providers to operate, including providers for content delivery, security, hosting, and payment processing. These providers may set their own cookies. We do not control the cookies set by these third parties, and their use is governed by their own respective privacy and cookie policies.',
        ],
      },
      {
        heading: '2. Analytics and Advertising Cookies',
        body: [
          'Soteria does not use cookies for advertising, tracking, or profiling purposes. We do not serve ads and we do not use any third-party advertising platforms that set cookies on your device.',
          'Our infrastructure provider, Cloudflare, may collect aggregated analytics data (such as page views and visitor counts) as part of its content delivery and security services. Cloudflare may also set cookies (such as __cf_bm) for bot management and security purposes. These cookies are set by Cloudflare, not by Soteria, and are governed by Cloudflare\'s Privacy Policy.',
        ],
      },
      {
        heading: '3. Managing Cookies',
        body: [
          'Most web browsers allow you to control cookies through their settings. You can configure your browser to block or delete cookies, or to alert you when cookies are being set. However, if you disable strictly necessary cookies, some parts of the Service may not function correctly or at all.',
          'Common browser cookie settings:',
          '- Chrome: Settings > Privacy and security > Cookies and other site data',
          '- Firefox: Settings > Privacy & Security > Cookies and Site Data',
          '- Safari: Preferences > Privacy > Manage Website Data',
          '- Edge: Settings > Cookies and site permissions > Cookies and site data',
        ],
      },
      {
        heading: '4. Do Not Track',
        body: [
          'We do not currently respond to browser "Do Not Track" (DNT) signals. There is no uniform standard for how DNT signals should be interpreted, and as we do not use tracking or advertising cookies, our behavior is consistent regardless of your DNT setting.',
        ],
      },
      {
        heading: '5. Changes to This Policy',
        body: [
          'We may update this Cookie Policy from time to time, at our sole discretion and without prior notice. The "Last updated" date at the top of this page reflects the most recent revision. Your continued use of the Service after a revision is posted constitutes your acceptance of the updated policy.',
        ],
      },
      {
        heading: '6. Contact Us',
        body: ['If you have any questions about our use of cookies, please contact us at legal@soteria.rip.'],
      },
    ],
  },
  {
    slug: 'acceptable-use',
    title: 'Acceptable Use Policy',
    updated: '7/20/2026',
    intro:
      'This Acceptable Use Policy ("AUP") supplements Soteria\'s Terms of Service and sets out the rules for using our platform located at soteria.rip, including the obfuscation service, Oracle whitelist and key system, Genesis decompiler, and any related tools (the "Service"). By using the Service, you agree to comply with this AUP in addition to our Terms of Service. Soteria does not support, condone, or endorse exploiting, hacking, cheating, or any form of unauthorized modification of Roblox or any other platform. The Service is intended for legitimate purposes only.',
    sections: [
      {
        heading: '1. Prohibited Content',
        body: [
          'You must not upload, obfuscate, distribute, or otherwise process through the Service any script or code that:',
          '- Contains stealers, info loggers, keyloggers, script crashers, denial-of-service scripts, ransomware, trojans, or any other malware designed to damage, disable, disrupt, or gain unauthorized access to any system, device, or account.',
          '- Is designed to harvest, scrape, or exfiltrate personal data, credentials, tokens, or session information from users without their knowledge and consent.',
          '- Facilitates phishing, social engineering, or impersonation attacks against any person or entity.',
          '- Contains child sexual abuse material (CSAM) or exploits minors in any way.',
          '- Promotes or incites violence, terrorism, or self-harm.',
        ],
      },
      {
        heading: '2. Prohibited Conduct',
        body: [
          'When using the Service, you must not:',
          '- Use the Service to conceal or disguise code that violates the terms of service, anti-cheat systems, or intellectual property rights of any third-party platform.',
          '- Reverse engineer, decompile, deobfuscate, or attempt to derive the source code, algorithms, or underlying structure of the Service, our obfuscator, or our key system.',
          '- Attempt to bypass, weaken, or circumvent any security, licensing, or technical protection measure used by the Service.',
          '- Use bots, scrapers, or automated means to interact with the Service except through our official API.',
          '- Send excessive requests or take any action intended to disrupt, degrade, or impair the performance of the Service.',
          '- Probe, scan, or test for vulnerabilities in the Service or attempt to breach any security measure.',
          '- Create multiple accounts to evade bans, suspensions, rate limits, or any other restrictions.',
          '- Use disposable or temporary email addresses to register or maintain an account.',
          '- Share, sell, or sublicense your account, keys, or whitelist credentials without written permission.',
          '- Impersonate any person or entity, or use the Service to harass, threaten, or harm others.',
          '- Misuse Discord bot staff access granted to you by an Oracle service creator.',
        ],
      },
      {
        heading: '3. Resource Usage',
        body: [
          'You must use the Service responsibly and not consume resources in a way that degrades the experience for other users. This includes but is not limited to:',
          '- Submitting an abnormally high volume of obfuscation or decompilation requests in a short period.',
          '- Attempting to circumvent rate limits or usage quotas through any means.',
          '- Using the Service in a manner that places excessive load on our infrastructure.',
        ],
      },
      {
        heading: '4. Intellectual Property',
        body: [
          'You must only upload and obfuscate scripts that you own or have the legal right to modify and distribute. Using the Service to process stolen, pirated, or unauthorized code is strictly prohibited. If we receive a credible report that you have processed code you do not have rights to, we may suspend your account and revoke associated keys without notice.',
          'The obfuscated output produced by the Service contains proprietary transformations that are the intellectual property of Soteria. You may not reverse engineer, decompile, or deobfuscate any output produced by the Service.',
        ],
      },
      {
        heading: '5. Trademark and Branding',
        body: [
          'You must not:',
          '- Use the Soteria name, logo, branding, or any confusingly similar marks to market, promote, or endorse any product or service without our express written consent.',
          '- List, reference, or include the Soteria name or branding in any reverse engineering, deobfuscation, or decompilation tool, service, or bot.',
          '- Imply any affiliation, endorsement, or partnership with Soteria without our express written consent.',
          '- Use the Soteria name or branding in any context that is misleading, disparaging, or likely to cause confusion about our products or services.',
        ],
      },
      {
        heading: '6. Enforcement',
        body: [
          'Violations of this AUP may result in any or all of the following, at our sole discretion and without prior notice:',
          '- Warning or temporary suspension of your account.',
          '- Permanent termination of your account and revocation of all associated keys.',
          '- Forfeiture of any unused tokens or remaining membership time without refund.',
          '- Reporting to relevant law enforcement or third-party platforms where we believe the law or the rights of others have been violated.',
          'We reserve the right to determine what constitutes a violation of this AUP. Our failure to enforce any provision does not waive our right to enforce it in the future.',
        ],
      },
      {
        heading: '7. Reporting Violations',
        body: [
          'If you become aware of any violation of this AUP, please report it to us immediately. We take all reports seriously and will investigate in good faith. Contact us at legal@soteria.rip.',
        ],
      },
    ],
  },
];

export function getLegalDoc(slug: string): LegalDoc | undefined {
  return legalDocs.find((d) => d.slug === slug);
}
