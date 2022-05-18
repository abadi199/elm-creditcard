module DemoFormModel exposing (main)

import Browser
import CreditCard
import CreditCard.Config
import Html exposing (Html, div, form, input, label, p, text)


main : Program () Model Msg
main =
    Browser.sandbox
        { init = init
        , view = view
        , update = update
        }


type alias Model =
    { number : Maybe String
    , name : Maybe String
    , month : Maybe String
    , year : Maybe String
    , cvv : Maybe String
    , state : CreditCard.State
    , shippingAddress : Maybe String
    , shippingState : Maybe String
    }


type Msg
    = NoOp
    | UpdateCardData Model


init : Model
init =
    { number = Nothing
    , name = Nothing
    , month = Nothing
    , year = Nothing
    , cvv = Nothing
    , state = CreditCard.initialState
    , shippingAddress = Nothing
    , shippingState = Nothing
    }


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
            model
        ]


update : Msg -> Model -> Model
update msg model =
    case msg of
        NoOp ->
            model

        UpdateCardData cardData ->
            cardData
