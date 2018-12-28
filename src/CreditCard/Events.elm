module CreditCard.Events exposing (updateCVVFocus, onCVVFocus, onCVVBlur)

{-| Helpers function for all events related to focus/blur of CVV field for card flipping effects.
See examples in the demo folder of the git repo for some example on how to use this module.


# Events

@docs updateCVVFocus, onCVVFocus, onCVVBlur

-}

import CreditCard.Internal exposing (CVVPosition(..), CardData, State(..), getStateValue)
import Helpers.CardType
import Html
import Html.Events exposing (onBlur, onFocus)


{-| Helper function to update the focus state of the cvv field in the internal state
-}
updateCVVFocus : Bool -> CardData model -> CardData model
updateCVVFocus isFocused cardData =
    let
        stateValue =
            getStateValue cardData.state

        cardInfo =
            Helpers.CardType.detect cardData

        updatedStateValue =
            case ( isFocused, cardInfo.cvvPosition ) of
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


{-| `onFocus` event for the CVV field.
This will update the focus state of the cvv field to `True` in the internal state
-}
onCVVFocus : (State -> msg) -> CardData model -> Html.Attribute msg
onCVVFocus tagger cardData =
    let
        updatedCardData =
            updateCVVFocus True cardData
    in
    onFocus (tagger updatedCardData.state)


{-| `onBlur` event for the CVV field.
This will update the focus state of the cvv field to `False` in the internal state
-}
onCVVBlur : (State -> msg) -> CardData model -> Html.Attribute msg
onCVVBlur tagger cardData =
    let
        updatedCardData =
            updateCVVFocus False cardData
    in
    onBlur (tagger updatedCardData.state)
