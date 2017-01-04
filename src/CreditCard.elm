module CreditCard exposing (card, State, initialState, CardData, form)

{-|
# View
@docs card,  form

# Data
@docs CardData

# Internal State
@docs State, initialState
-}

import CreditCard.Components.Card
import CreditCard.Config exposing (Config, FormConfig, Updaters)
import CreditCard.Internal
import Helpers.CardType
import Helpers.Misc
import Html exposing (Html, div, label, p, text)
import Html.Attributes exposing (class)
import Input.Number
import String


{-| Internal State of the card view
-}
type alias State =
    CreditCard.Internal.InternalState


{-| Initial state of the card view
-}
initialState : State
initialState =
    CreditCard.Internal.initialState



-- VIEW


{-| Card Data
-}
type alias CardData model =
    { model
        | number : Maybe String
        , name : Maybe String
        , month : Maybe String
        , year : Maybe String
        , ccv : Maybe String
        , state : State
    }


{-| Card view
-}
card : Config {} -> CardData model -> Html msg
card config cardData =
    let
        cardInfo =
            Helpers.CardType.detect cardData
    in
        CreditCard.Components.Card.card config cardInfo cardData


{-| Form view
-}
form : Config (FormConfig (Updaters msg)) -> CardData model -> Html msg
form config cardData =
    let
        cardInfo =
            Helpers.CardType.detect cardData

        ( minLength, maxLength ) =
            Helpers.Misc.minMaxNumberLength cardInfo

        numberConfig =
            let
                default =
                    Input.Number.defaultOptions <| toMaybeInt config.updateNumber
            in
                { default | maxLength = Just maxLength }

        toMaybeInt : (Maybe String -> msg) -> (Maybe Int -> msg)
        toMaybeInt msg =
            (\maybeInt -> msg <| Maybe.map toString maybeInt)
    in
        div []
            [ CreditCard.Components.Card.card config cardInfo cardData
            , p [ class config.classes.number ]
                [ label [] [ text config.labels.number ]
                , Input.Number.input numberConfig [] (cardData.number |> Maybe.andThen (String.toInt >> Result.toMaybe))
                ]
            ]
