module CardDemo exposing (main)

import Html exposing (Html, form, text, select, label, option, input)
import Html.Attributes exposing (class, type_)
import Html.Events exposing (onCheck)
import CreditCard
import CreditCard.Config
import CreditCard.Events
import Dict
import Dropdown


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
    , ccv : Maybe String
    , state : CreditCard.State
    }


cardNumbers : Dict.Dict String String
cardNumbers =
    Dict.fromList
        [ ( "MasterCard", "5105105105105100" )
        , ( "Visa", "4111111111111111" )
        , ( "AmericanExpress", "378282246310005" )
        , ( "Discover", "6011000990139424" )
        , ( "DinersClub", "30569309025904" )
        , ( "JCB", "3530111333300000" )
        , ( "Visa Electron", "4917300800000000" )
        ]


type Msg
    = NoOp
    | SelectCardNumber (Maybe String)
    | ViewCCV Bool


init : ( Model, Cmd Msg )
init =
    ( { number = Nothing
      , name = Just "John Smith"
      , month = Just "12"
      , year = Just "2025"
      , ccv = Just "1234"
      , state = CreditCard.initialState
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
            CreditCard.Config.defaultConfig

        toItems name number =
            { value = number, text = name, enabled = True }

        defaultOptions =
            Dropdown.defaultOptions SelectCardNumber
    in
        form []
            [ CreditCard.card
                config
                model
            , label [ class "card-type-dropdown" ]
                [ text "Card Type"
                , Dropdown.dropdown
                    { defaultOptions
                        | emptyItem = Just { value = "", text = "-Please select-", enabled = True }
                        , items = cardNumbers |> Dict.map toItems |> Dict.values
                    }
                    []
                    model.number
                ]
            , label [ class "see-ccv-checkbox" ]
                [ input [ type_ "checkbox", onCheck <| ViewCCV ]
                    []
                , text "View CCV"
                ]
            ]


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        NoOp ->
            ( model, Cmd.none )

        SelectCardNumber number ->
            ( { model | number = number }, Cmd.none )

        ViewCCV bool ->
            ( CreditCard.Events.updateCCVFocus bool model
            , Cmd.none
            )
