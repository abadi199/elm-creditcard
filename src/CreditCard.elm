module CreditCard exposing (card, State, initialState)

{-|
# View
@docs card

# Internal State
@docs State, initialState
-}

import Html exposing (Html)
import CreditCard.Internal
import CreditCard.Config
import CreditCard.Components.Card
import Helpers.CardType


{-| Internal State of the card view
-}
type alias State msg =
    CreditCard.Internal.InternalState msg


{-| Initial state of the card view
-}
initialState : State msg
initialState =
    CreditCard.Internal.initialState



-- VIEW


type alias CardData msg model =
    CreditCard.Internal.CardData msg model


{-| Card view
-}
card : CreditCard.Config.Config -> State msg -> CardData msg model -> Html msg
card config state cardData =
    let
        cardInfo =
            Helpers.CardType.detect cardData
    in
        CreditCard.Components.Card.card config cardInfo cardData
