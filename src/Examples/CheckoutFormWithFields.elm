module CheckoutFormWithFields exposing (main)

import CreditCard
import Html.App as App
import Html exposing (Html, form, button, label, text, input, p, div)
import Html.Attributes exposing (placeholder, for, id, class)


main =
    App.program
        { init = ( init, Cmd.none )
        , view = view
        , update = update
        , subscriptions = \_ -> Sub.none
        }


type alias Model =
    { creditCard : CreditCard.Model
    , address1 : String
    , address2 : String
    , city : String
    , state : String
    , zipCode : String
    }


init =
    { creditCard = CreditCard.init
    , address1 = ""
    , address2 = ""
    , city = ""
    , state = ""
    , zipCode = ""
    }


view : Model -> Html Msg
view model =
    form []
        [ App.map CreditCardMsg (CreditCard.cardView model.creditCard)
        , p [ class "number" ]
            [ label [ for "CreditCardNumber" ] [ text "Number" ]
            , App.map CreditCardMsg (CreditCard.numberInput "CreditCardNumber" model.creditCard)
            ]
        , p [ class "name" ]
            [ label [ for "CreditCardName" ] [ text "Name" ]
            , App.map CreditCardMsg (CreditCard.nameInput "CreditCardName" [ class "input-control" ] model.creditCard)
            ]
        , div [ class "container" ]
            [ p [ class "expiration" ]
                [ label [ for "CreditCardNumber" ] [ text "Expiration Date" ]
                , App.map CreditCardMsg (CreditCard.monthInput "CreditCardMonth" model.creditCard)
                , App.map CreditCardMsg (CreditCard.yearInput "CreditCardYear" model.creditCard)
                ]
            , p [ class "ccv" ]
                [ label [ for "CreditCardCcv" ] [ text "Number" ]
                , App.map CreditCardMsg (CreditCard.ccvInput "CreditCardCcv" model.creditCard)
                ]
            , button [] [ text "Submit" ]
            ]
        ]


type Msg
    = NoOp
    | CreditCardMsg CreditCard.Msg


update msg model =
    case msg of
        NoOp ->
            ( model, Cmd.none )

        CreditCardMsg creditCardMsg ->
            let
                ( creditCardModel, creditCardCmd ) =
                    CreditCard.update creditCardMsg model.creditCard
            in
                ( { model | creditCard = creditCardModel }, Cmd.map CreditCardMsg creditCardCmd )
