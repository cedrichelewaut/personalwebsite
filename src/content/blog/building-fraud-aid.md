---
title: "Building Fraud Aid: first aid for scam victims"
summary: "Why I built a free guide for people who were just scammed in Belgium, how it works, and what is still missing before it can be used for real."
noteDate: 2026-11-02
order: 1
draft: false
---

When someone is scammed, the first hours decide what can still be done. The card has to be blocked, the police told, and the bank sent a written claim. Most people do not know that order, or what to write, and they are often ashamed and in a hurry. I built Fraud Aid to be the thing I would want open on the screen in that moment.

You can [try the demo](/fraud-aid-demo/). It runs entirely in your browser and sends nothing anywhere. Please do not type real personal data into it. The [code is on GitHub](https://github.com/cedrichelewaut/fraud-aid).

## What it does

Fraud Aid asks one question per screen: what happened, how much, how you paid, whether you approved the payment, when, and with which bank. From the answers it gives a five-step plan: call Card Stop, report to the police, call the bank and send a written claim, claim the money back, and protect yourself afterwards. The claim letter and the police report are written for you, in English, French or Dutch.

It also gives an honest first verdict: a strong case, a possible one, an unlikely one, or unclear. It is only an estimate and is labelled as one. Under Belgian and EU payment rules, whether a bank has to refund you depends heavily on how the payment was made and whether you approved it yourself, so a plain rule set can say a lot.

There is a second path. If you would rather not do the claim yourself, an expert can handle it for a success fee: 20% plus VAT, 10% more if the case is escalated, and nothing if nothing is recovered. That part is a prototype with case intake, evidence upload, a private status page and a back office. In the demo you can try all of it and see the result on your own device only.

## The language model decides nothing legal

My first version let a local language model chat with the victim and call tools. In testing, the 8B model skipped the tool, said it had "checked with KBC", invented a bank phone number and email, and wrote a letter citing Dutch law. For a person in a crisis that is worse than no help at all.

So everything the user relies on is now deterministic. Fixed rules give the verdict, a fixed builder gives the five steps, and templates produce the letter and the report. The model has one small job: rewriting the victim's own words into a short first-person statement for the documents, which is shown to them to check. If it fails, their own words are used. The demo has no model at all and uses their own words directly.

## Learning to distrust everything

There is also a "learn more" path with seven short topics on phone calls, messages and links, cloned voices, investments, marketplaces and your accounts. Its premise is uncomfortable: there are no reliable tells any more. Skilled fraudsters are calm, know your details and may even tell you to hang up and call the bank. So it teaches people to judge what is being asked, to verify through a channel they choose themselves, to go to the bank in person when unsure, and to talk to someone they trust.

## How the demo runs without a server

My site is static, so the app cannot run on a backend here. Instead the demo runs the real Python code, the rules, plan builder and case handling, inside your browser with [Pyodide](https://pyodide.org), a Python that is compiled to WebAssembly. Cases are stored in your browser's own storage, so nothing you enter reaches me or anyone else, and a case you create exists only on that device. The first load downloads about 16 MB. The back office in the demo is at [admin.html](/fraud-aid-demo/admin.html) with the token `demo`.

## What is not done

Fraud Aid is a prototype and **not safe for real victims yet**.

- The paid tier needs EU hosting, encryption, a proper admin login and email notifications.
- A Belgian lawyer must review the fee terms and the verdict wording, and a fraud specialist the education text. Native speakers should check the French and Dutch. An open legal question is whether someone who is not a lawyer may handle claims in Belgium at all.
- I have not verified refund rates by bank in Belgium, or whether people would pay for this. Those two things decide whether it works as a business.

The next steps are a conversation with a Belgian lawyer, then testing it with a few real victims or a contact at a bank. If you work in fraud, banking or law in Belgium and want to help, I would like to hear from you.
