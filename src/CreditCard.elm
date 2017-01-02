module CreditCard exposing (card, State, initialState, CardData)

{-|
# View
@docs card, CardData

# Internal State
@docs State, initialState
-}

import Html exposing (Html)
import CreditCard.Internal
import CreditCard.Config exposing (Config)
import CreditCard.Components.Card
import Helpers.CardType


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
card : Config -> State -> CardData model -> Html msg
card config state cardData =
    let
        cardInfo =
            Helpers.CardType.detect cardData
    in
        CreditCard.Components.Card.card config cardInfo cardData
