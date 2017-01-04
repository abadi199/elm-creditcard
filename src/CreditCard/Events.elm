module CreditCard.Events exposing (onCCVFocus, onCCVBlur, updateCCVFocus)

import CreditCard.Internal exposing (CCVPosition(..), CardData, State(..), getStateValue)
import Helpers.CardType
import Html
import Html.Events exposing (onBlur, onFocus)


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


onCCVFocus : (State -> msg) -> CardData model -> Html.Attribute msg
onCCVFocus tagger cardData =
    let
        updatedCardData =
            updateCCVFocus True cardData
    in
        onFocus (tagger updatedCardData.state)


onCCVBlur : (State -> msg) -> CardData model -> Html.Attribute msg
onCCVBlur tagger cardData =
    let
        updatedCardData =
            updateCCVFocus False cardData
    in
        onBlur (tagger updatedCardData.state)
