# Elm Credit Card

Pretty credit card input form inspired by https://github.com/jessepollak/card 

Everything is written in Elm without any external javascript, and css.


![alt text](https://github.com/abadi199/elm-creditcard/raw/master/images/form.gif "Sample of Credit Card Form")

## Features
 * Interactive update of the card type and information.
 * Supports multiple card type: Visa, Mastercard, American Express, Discover, Diners Club, JCB, Laser, Maestro, and Visa Electron
 * No external css or JavaScript dependency. The credit cards and logos are all svg dynamically generated using elm-svg.
 * Implements The Elm Architecture.

## Live Demo
See [here](http://abadi199.github.io/elm-creditcard#live-demo) for live demo

## How to Use

This component implements [The Elm Architecture (TEA)](http://guide.elm-lang.org/architecture/index.html), so if you're application also implements TEA, then using this components is simply by adding it to be part of your `view`, `update`, and `Model`.

You can use this component in two ways; one is by rendering the whole form together, or rendering each input fields and card individually.

**Example of rendering the whole form:**
```haskell
import CreditCard 
import Html.App

type alias Model =
    { creditCard = CreditCard.Model 
      ...
    }

view model = 
    form [] 
        [ Html.App.map CardUpdate CreditCard.form 
        ...
        ]

type Msg = CreditCardMsg CreditCard.Msg

update msg model =
    case msg of
        CreditCardMsg creditCardMsg ->
            let
                ( creditCardModel, creditCardCmd ) =
                    CreditCard.update creditCardMsg model.creditCard
            in
                ( { model | creditCard = creditCardModel }, Cmd.map CreditCardMsg creditCardCmd )
        ...
```
You can see the full code for this in this [example](https://github.com/abadi199/elm-creditcard/blob/master/src/Examples/CheckoutForm.elm)

**Example of rendering each sub-components individually:**
```haskell
import CreditCard 
import Html.App

type alias Model =
    { creditCard = CreditCard.Model 
      ...
    }

view model = 
    form [] 
        [ Html.App.map CreditCardMsg (CreditCard.cardView model.creditCard)
        , p []
            [ label [ for "CreditCardNumber" ] [ text "Number" ]
            , App.map CreditCardMsg (CreditCard.numberInput "CreditCardNumber" model.creditCard)
            ]
        , p []
            [ label [ for "CreditCardName" ] [ text "Name" ]
            , App.map CreditCardMsg (CreditCard.nameInput "CreditCardName" [ class "input-control" ] model.creditCard)
            ]
        , p []
            [ label [ for "CreditCardNumber" ] [ text "Expiration Date" ]
            , App.map CreditCardMsg (CreditCard.monthInput "CreditCardMonth" model.creditCard)
            , App.map CreditCardMsg (CreditCard.yearInput "CreditCardYear" model.creditCard)
            ]
        , p []
            [ label [ for "CreditCardCcv" ] [ text "Number" ]
            , App.map CreditCardMsg (CreditCard.ccvInput "CreditCardCcv" model.creditCard)
            ]
        ...
        ]

type Msg = CreditCardMsg CreditCard.Msg

update msg model =
    case msg of
        CreditCardMsg creditCardMsg ->
            let
                ( creditCardModel, creditCardCmd ) =
                    CreditCard.update creditCardMsg model.creditCard
            in
                ( { model | creditCard = creditCardModel }, Cmd.map CreditCardMsg creditCardCmd )
        ...
```
You can see the full code for this in this [example](https://github.com/abadi199/elm-creditcard/blob/master/src/Examples/CheckoutFormWithFields.elm)

## Options
TBA

## Style
TBA

## License
The MIT License (MIT)
Copyright &copy; 2016 Abadi Kurniawan
