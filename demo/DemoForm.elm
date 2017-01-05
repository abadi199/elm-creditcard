module DemoForm exposing (main)

import Html exposing (Html, div, input, label, text, p, form)
import CreditCard
import CreditCard.Config


main : Program Never Model Msg
main =
    Html.program
        { init = init
        , subscriptions = subscriptions
        , view = view
        , update = update
        }


type alias Model =
    { cardData : CreditCard.CardData {}
    }


type Msg
    = NoOp
    | UpdateCardData (CreditCard.CardData {})


init : ( Model, Cmd Msg )
init =
    ( Model CreditCard.emptyCardData
    , Cmd.none
    )


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.none


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


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        NoOp ->
            ( model, Cmd.none )

        UpdateCardData cardData ->
            ( { model | cardData = cardData }, Cmd.none )
