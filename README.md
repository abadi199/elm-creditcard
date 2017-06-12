# Elm Credit Card

Pretty credit card input form inspired by https://github.com/jessepollak/card

Everything is written in Elm without any external javascript, or css.


![alt text](https://github.com/abadi199/elm-creditcard/raw/master/images/form.gif "Sample of Credit Card Form")

## Features
 * Interactive update of the card type and information.
 * Can be used as just the card view, or as part of the credit card form.
 * Supports multiple card type: Visa, Mastercard, American Express, Discover, Diners Club, JCB, Laser, Maestro, and Visa Electron
 * No external CSS or JavaScript dependency. The credit cards and logos are all svg dynamically generated using elm-svg.
 * Implemented as reusable views that will fit nicely with The Elm Architecture.

## Live Demo
See [here](http://abadi199.github.io/elm-creditcard#live-demo) for live demo

## How to Install
You can install this package running:
```
elm-package install abadi199/elm-creditcard
```
or by manually adding `abadi199/elm-creditcard` to your `elm-package.json`.

## How to Use

This component implements [The Elm Architecture (TEA)](http://guide.elm-lang.org/architecture/index.html), so if you're application also implements TEA, then using this components is simply by adding it to be part of your `view`, `update`, and `Model`.

You can use this component in two ways; one is by rendering the whole form together, or rendering each input fields and card individually.

**Example of using `card` view:**
```elm
import CreditCard
import CreditCard.Config

type alias Model =
    { number : Maybe String
    , name : Maybe String
    , month : Maybe String
    , year : Maybe String
    , cvv : Maybe String
    , state : CreditCard.State
    }

view model =
    CreditCard.card CreditCard.Config.defaultConfig model

```
**Example of using `form` view:**
```elm
import CreditCard
import CreditCard.Config

type alias Model =
    { number : Maybe String
    , name : Maybe String
    , month : Maybe String
    , year : Maybe String
    , cvv : Maybe String
    , state : CreditCard.State
    ...
    }

type Msg
  = UpdateCardData Model
  ...

view model =
    ...
    CreditCard.form (CreditCard.Config.defaultFormConfig UpdateCardData) model
    ...

update msg model =
    case msg of
        UpdateCardData updatedModel ->
            ( updatedModel, Cmd.none )

        ...

```
You can see the full code for this in the [example](https://github.com/abadi199/elm-creditcard/blob/master/src/Examples/) folder.

## Documentations
Please see [Elm Package](http://package.elm-lang.org/packages/abadi199/elm-creditcard/latest) for complete documentation.

## Contributing
- [Submit a pull request](https://github.com/abadi199/elm-creditcard)! If you're missing a feature you want to have, or just found a bug, or found an error in the docs, please submit a pull request.
- [Create an issue](https://github.com/abadi199/elm-creditcard/issues)! If you found a bug or want a new feature that you think will make the library better, but don't have time to do it yourself, please submit an issue.
- Message me on slack or [twitter](https://twitter.com/abadikurniawan) if you just want to give me a feedback or thank me. I'm [abadi199](https://elmlang.slack.com/team/abadi199) on [elm-lang](https://elmlang.herokuapp.com/) slack channel.

## License
Apache 2.0
