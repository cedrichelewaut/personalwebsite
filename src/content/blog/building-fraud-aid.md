---
title: "Building Fraud Aid: first aid for scam victims"
summary: "A free guide for people just scammed in Belgium, and what is still missing before it can be used for real."
noteDate: 2026-11-02
order: 1
draft: false
---

When someone is scammed, the first hours decide what can still be done: block the card, tell the police, send the bank a written claim. Most people do not know that order or what to write. Fraud Aid is what I would want open on the screen in that moment.

[![The plan Fraud Aid gives after a few questions](/img/fraud-aid-demo.webp)](/fraud-aid-demo/)

**[Try the demo](/fraud-aid-demo/)**. It runs entirely in your browser and sends nothing anywhere, so please do not enter real personal data. The [code is on GitHub](https://github.com/cedrichelewaut/fraud-aid).

## What it does

One question per screen: what happened, how much, how you paid, whether you approved it, when, which bank. You get a five-step plan (Card Stop, police, bank, claim back, protect yourself), a first verdict (strong, possible, unlikely or unclear), and a claim letter and police report in English, French or Dutch. If you would rather not do it yourself, an expert can handle the claim for a success fee, and nothing is charged if nothing is recovered.

## The model decides nothing legal

My first version let a local language model chat and call tools. The 8B model skipped the tool, claimed it had "checked with KBC", invented a bank phone number and cited Dutch law. So the verdict, the steps and the documents now come from fixed rules and templates. The model only rewrites the victim's own words into a short statement, which they check. The demo has no model at all.

## How the demo runs without a server

My site is static, so the demo runs the real Python code in your browser with [Pyodide](https://pyodide.org), and saves cases on your device only. The first load is about 16 MB. The back office is at [admin.html](/fraud-aid-demo/admin.html) with the token `demo`.

## What is missing

It is a prototype and **not safe for real victims yet**. It needs EU hosting, encryption and a proper admin login. A Belgian lawyer must review the fee terms and wording, including whether a non-lawyer may handle claims here at all, and a fraud specialist the education text. I have not verified refund rates by bank or whether people would pay. Next I want to talk to a lawyer, then test with a few real victims or a bank contact. If you work in fraud, banking or law in Belgium, I would like to hear from you.
