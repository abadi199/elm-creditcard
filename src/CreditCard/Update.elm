module CreditCard.Update exposing (Msg(..), update)

{-| Update functions and Msg.

# Message
@docs Msg

# Update functions
@docs update
-}

import Input.Number as Number
import Input.Text as Text
import CreditCard.Model exposing (Model, Field, CCVPosition(..))
import String
import Helpers.CardType as CardType
import Helpers.Misc as Helper
import Task


{-| A union type representing The Elm Architect's `Msg`
-}
type Msg
    = NoOp
    | UpdateNumber Number.Msg
    | UpdateName Text.Msg
    | UpdateExpirationMonth Number.Msg
    | UpdateExpirationYear Number.Msg
    | UpdateCCV Number.Msg
    | Flip Bool


{-| The Elm Architect's update function.
-}
update : Msg -> Model Msg -> ( Model Msg, Cmd Msg )
update msg model =
    case msg of
        NoOp ->
            ( model, Cmd.none )

        UpdateNumber numberMsg ->
            ( updateNumber numberMsg model
            , Cmd.none
            )

        UpdateName stringInputMsg ->
            ( { model | name = updateStringInput stringInputMsg model.name }
            , Cmd.none
            )

        UpdateExpirationMonth numberMsg ->
            ( { model | expirationMonth = updateNumberInput numberMsg model.expirationMonth }
            , Cmd.none
            )

        UpdateExpirationYear numberMsg ->
            ( { model | expirationYear = updateNumberInput numberMsg model.expirationYear }
            , Cmd.none
            )

        UpdateCCV numberMsg ->
            let
                updatedCcv =
                    updateNumberInput numberMsg model.ccv
            in
                ( { model | ccv = updatedCcv }
                , Task.succeed updatedCcv.hasFocus |> Task.perform (\_ -> NoOp) Flip
                )

        Flip flipped ->
            if Helper.cardInfo model |> .ccvPosition |> (==) Front then
                ( model, Cmd.none )
            else
                ( { model | flipped = Just flipped }, Cmd.none )


updateNumber : Number.Msg -> Model Msg -> Model Msg
updateNumber numberMsg model =
    let
        newField =
            updateNumberInput numberMsg model.number

        modelWithUpdatedNumber =
            { model | number = newField }

        cardInfo =
            CardType.detect modelWithUpdatedNumber

        modelWithUpdatedCardInfo =
            { modelWithUpdatedNumber | cardInfo = Just cardInfo }
    in
        modelWithUpdatedCardInfo


updateFieldValue : Maybe a -> Field a -> Field a
updateFieldValue newValue field =
    { field | value = newValue }


updateStringInput : Text.Msg -> Field String -> Field String
updateStringInput stringInputMsg field =
    let
        toField stringInputModel =
            { field
                | value = Just stringInputModel.value
                , hasFocus = stringInputModel.hasFocus
            }
    in
        field
            |> Helper.toStringInputModel
            |> Text.update stringInputMsg
            |> toField


updateNumberInput : Number.Msg -> Field String -> Field String
updateNumberInput numberMsg field =
    let
        toField numberInputModel =
            { field
                | value = Just numberInputModel.value
                , hasFocus = numberInputModel.hasFocus
            }
    in
        field
            |> Helper.toNumberInputModel
            |> Number.update numberMsg
            |> toField
