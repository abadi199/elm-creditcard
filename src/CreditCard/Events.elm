module CreditCard.Events exposing (onCCVFocus, onCCVBlur)

import CreditCard.Internal exposing (CCVPosition(..), CardData, InternalState(..), getStateValue)
import Helpers.CardType
import Html
import Html.Events exposing (onBlur, onFocus)


onCCVFocus : (InternalState -> msg) -> CardData model -> Html.Attribute msg
onCCVFocus tagger cardData =
    let
        stateValue =
            getStateValue cardData.state

        cardInfo =
            Helpers.CardType.detect cardData

        flip value =
            { stateValue | flipped = Just value }

        updatedStateValue =
            case cardInfo.ccvPosition of
                Front ->
                    flip False

                Back ->
                    flip True

        updatedState =
            InternalState updatedStateValue
    in
        onFocus (tagger updatedState)


onCCVBlur : (InternalState -> msg) -> CardData model -> Html.Attribute msg
onCCVBlur tagger cardData =
    let
        stateValue =
            getStateValue cardData.state

        updatedStateValue =
            { stateValue | flipped = Just False }

        updatedState =
            InternalState updatedStateValue
    in
        onBlur (tagger updatedState)
