module CreditCard.Events exposing (onCCVFocus, onCCVBlur, updateCCVFocus)

{-| Helpers function for all events related to focus/blur of CCV field for card flipping effects.
See examples in the demo folder of the git repo for some example on how to use this module.

# Events
@docs updateCCVFocus, onCCVFocus, onCCVBlur
-}

import CreditCard.Internal exposing (CCVPosition(..), CardData, State(..), getStateValue)
import Helpers.CardType
import Html
import Html.Events exposing (onBlur, onFocus)


{-| Helper function to update the focus state of the ccv field in the internal state
-}
updateCCVFocus : Bool -> CardData model -> CardData model
updateCCVFocus isFocused cardData =
    let
        stateValue =
            getStateValue cardData.state

        cardInfo =
            Helpers.CardType.detect cardData

        updatedStateValue =
            case ( isFocused, cardInfo.ccvPosition ) of
                ( False, _ ) ->
                    flip False

                ( _, Front ) ->
                    flip False

                ( _, Back ) ->
                    flip True

        flip value =
            { stateValue | flipped = Just value }

        updatedState =
            InternalState updatedStateValue
    in
        { cardData | state = updatedState }


{-| `onFocus` event for the CCV field.
This will update the focus state of the ccv field to `True` in the internal state
-}
onCCVFocus : (State -> msg) -> CardData model -> Html.Attribute msg
onCCVFocus tagger cardData =
    let
        updatedCardData =
            updateCCVFocus True cardData
    in
        onFocus (tagger updatedCardData.state)


{-| `onBlur` event for the CCV field.
This will update the focus state of the ccv field to `False` in the internal state
-}
onCCVBlur : (State -> msg) -> CardData model -> Html.Attribute msg
onCCVBlur tagger cardData =
    let
        updatedCardData =
            updateCCVFocus False cardData
    in
        onBlur (tagger updatedCardData.state)
