module DemoForm exposing (main)

import Browser
import Html exposing (Html, div, input, label, text, p, form)
import CreditCard
import CreditCard.Config


main : Program () Model Msg
main =
    Browser.sandbox
        { init = init
        , view = view
        , update = update
        }


type alias Model =
    { cardData : CreditCard.CardData {}
    }


type Msg
    = NoOp
    | UpdateCardData (CreditCard.CardData {})


init : Model
init =
    Model CreditCard.emptyCardData



view : Model -> Html Msg
view model =
    let
        config =
            CreditCard.Config.defaultFormConfig UpdateCardData
    in
        form []
            [ CreditCard.form
                config
                model.cardData
            ]


update : Msg -> Model -> Model
update msg model =
    case msg of
        NoOp ->
            model

        UpdateCardData cardData ->
            { model | cardData = cardData }
