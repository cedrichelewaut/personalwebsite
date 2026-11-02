---
title: "Fraud Aid"
year: "2026"
summary: "First aid for scam victims in Belgium: a step-by-step plan, a claim letter for the bank and a police report."
url: "https://github.com/cedrichelewaut/fraud-aid"
order: 5
draft: false
---

When someone is scammed, the first hours decide what can still be done: blocking the card, reporting to the police, and sending the bank a written claim. Most victims do not know the order or the wording, and PSD3 and the new Payment Services Regulation are about to make bank refunds a bigger question in the EU.

Fraud Aid is a prototype for Belgium. A short guided questionnaire gives a five-step plan (Card Stop, police, bank, claim back, protect yourself) together with a claim letter and a police report in English, French or Dutch. People can do all of it themselves for free or ask an expert to handle the claim for a success fee.

The language model never decides anything legal. Plain rules give the verdict, and the model only rewrites the victim's own words into a short statement for the documents. An earlier version let the model call tools freely, and I dropped it after the 8B model skipped tools, invented phone numbers and cited Dutch law.

It is a prototype and not yet open to real cases. It needs review by a Belgian lawyer and a fraud specialist, and proper hosting, before it can be used. You can [try the demo](/fraud-aid-demo/), which runs entirely in your browser, read [the article](/blog/building-fraud-aid/), or see the code on GitHub.
