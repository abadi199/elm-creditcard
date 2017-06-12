module DemoFormModel exposing (main)

import CreditCard
import CreditCard.Config
import Html exposing (Html, div, form, input, label, p, text)


main : Program Never Model Msg
main =
    Html.program
        { init = init
        , subscriptions = subscriptions
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


init : ( Model, Cmd Msg )
init =
    ( { number = Nothing
      , name = Nothing
      , month = Nothing
      , year = Nothing
      , cvv = Nothing
      , state = CreditCard.initialState
      , shippingAddress = Nothing
      , shippingState = Nothing
      }
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
            model
        ]


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        NoOp ->
            ( model, Cmd.none )

        UpdateCardData cardData ->
            ( cardData, Cmd.none )
