# Motivation ⛽️

Program "almost exclusively" (99%) writing plain language in `/context`

## Secondary

* Public good
* Tooling

## Questions

* Can it hew to my "ideal project structure"
* Can you get aider to prompt itself (via draider looping)?
* Will it process from a backlog?
* Can it incorporate bivvy? Should it?
* Can I get it to "think about" its own mission, and document pros and cons as history?
* How often does Aider end with commands to run?

### Answers

* Will it generate ./context/readme.md?
  * Yes, it will try
* Will it generate aider conf?
  * Not easily, aider gets in the way of that by adding .aider* to .gitignore and I do not want to fight aider

## Observations

* It is hard to get aider to stop.
* It doesn't always move things to complete
  * Sometimes it leaves a copy in progress in addition to complete
  * Should execute be followed by "Clean?"
* I wrote "Confirm Project Status Green" but it is an entirely human document
