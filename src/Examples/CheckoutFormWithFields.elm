module CheckoutFormWithFields exposing (main)

import CreditCard.View
import CreditCard.Model
import CreditCard.Update
import Html.App as App
import Html exposing (Html, form, button, label, text, input, p, div)
import Html.Attributes exposing (placeholder, for, id, class)


main : Program Never
main =
    App.program
        { init = ( init, Cmd.none )
        , view = view
        , update = update
        , subscriptions = \_ -> Sub.none
        }


type alias Model =
    { creditCard : CreditCard.Model.Model CreditCard.Update.Msg
    , address1 : String
    , address2 : String
    , city : String
    , state : String
    , zipCode : String
    }


init : Model
init =
    { creditCard = CreditCard.Model.init CreditCard.Model.defaultOptions
    , address1 = ""
    , address2 = ""
    , city = ""
    , state = ""
    , zipCode = ""
    }


view : Model -> Html Msg
view model =
    form []
        [ App.map CreditCardMsg (CreditCard.View.cardView model.creditCard)
        , p [ class "number" ]
            [ label [ for "CreditCardNumber" ] [ text "Number" ]
            , App.map CreditCardMsg (CreditCard.View.numberInput "CreditCardNumber" model.creditCard)
            ]
        , p [ class "name" ]
            [ label [ for "CreditCardName" ] [ text "Name" ]
            , App.map CreditCardMsg (CreditCard.View.nameInput "CreditCardName" [ class "input-control" ] model.creditCard)
            ]
        , div [ class "container" ]
            [ p [ class "expiration" ]
                [ label [ for "CreditCardNumber" ] [ text "Expiration Date" ]
                , App.map CreditCardMsg (CreditCard.View.monthInput "CreditCardMonth" model.creditCard)
                , App.map CreditCardMsg (CreditCard.View.yearInput "CreditCardYear" model.creditCard)
                ]
            , p [ class "ccv" ]
                [ label [ for "CreditCardCcv" ] [ text "Number" ]
                , App.map CreditCardMsg (CreditCard.View.ccvInput "CreditCardCcv" model.creditCard)
                ]
            , button [] [ text "Submit" ]
            ]
        ]


type Msg
    = NoOp
    | CreditCardMsg CreditCard.Update.Msg


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        NoOp ->
            ( model, Cmd.none )

        CreditCardMsg creditCardMsg ->
            let
                ( creditCardModel, creditCardCmd ) =
                    CreditCard.Update.update creditCardMsg model.creditCard
            in
                ( { model | creditCard = creditCardModel }, Cmd.map CreditCardMsg creditCardCmd )
