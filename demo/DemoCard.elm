module DemoCard exposing (main)

import Browser
import CreditCard
import CreditCard.Config
import CreditCard.Events exposing (onCVVBlur, onCVVFocus)
import Html exposing (Html, div, form, input, label, p, text)
import Html.Attributes exposing (type_, value)
import Html.Events exposing (onInput)


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
    }


type Msg
    = NoOp
    | UpdateCardNumber (Maybe String)
    | UpdateName (Maybe String)
    | UpdateMonth (Maybe String)
    | UpdateYear (Maybe String)
    | UpdateCVV (Maybe String)
    | UpdateState CreditCard.State


init : Model
init =
    Model Nothing Nothing Nothing Nothing Nothing CreditCard.initialState


view : Model -> Html Msg
view model =
    let
        config =
            CreditCard.Config.defaultConfig

        field labelText typeValue val msg =
            fieldWithAttributes [] labelText typeValue val msg

        fieldWithAttributes attributes labelText typeValue val msg =
            p []
                [ label []
                    [ text labelText
                    , input
                        ([ type_ typeValue
                         , value <| Maybe.withDefault "" val
                         , onInput (Just >> msg)
                         ]
                            ++ attributes
                        )
                        []
                    ]
                ]
    in
    form []
        [ CreditCard.card
            config
            model
        , field "Number" "number" model.number UpdateCardNumber
        , field "Name" "text" model.name UpdateName
        , field "Month" "number" model.month UpdateMonth
        , field "Year" "number" model.year UpdateYear
        , fieldWithAttributes
            [ onCVVFocus UpdateState model
            , onCVVBlur UpdateState model
            , onInput (Just >> UpdateCVV)
            ]
            "Cvv"
            "number"
            model.cvv
            UpdateCVV
        ]


update : Msg -> Model -> Model
update msg model =
    case msg of
        NoOp ->
            model

        UpdateCardNumber value ->
            { model | number = value }

        UpdateName value ->
            { model | name = value }

        UpdateMonth value ->
            { model | month = value }

        UpdateYear value ->
            { model | year = value }

        UpdateCVV value ->
            { model | cvv = value }

        UpdateState state ->
            { model | state = state }
