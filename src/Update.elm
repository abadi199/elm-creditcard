module Update exposing (..)

{-| Update
-}

import Components.NumberInput as NumberInput
import Components.StringInput as StringInput
import Model exposing (Model, Field, CCVPosition(..))
import String
import Helpers.CardType as CardType
import Helpers.Misc as Helper
import Task


type Msg
    = NoOp
    | UpdateNumber NumberInput.Msg
    | UpdateName StringInput.Msg
    | UpdateExpirationMonth NumberInput.Msg
    | UpdateExpirationYear NumberInput.Msg
    | UpdateCCV NumberInput.Msg
    | Flip Bool


update : Msg -> Model Msg -> ( Model Msg, Cmd Msg )
update msg model =
    case msg of
        NoOp ->
            ( model, Cmd.none )

        UpdateNumber numberInputMsg ->
            ( updateNumber numberInputMsg model
            , Cmd.none
            )

        UpdateName stringInputMsg ->
            ( { model | name = updateStringInput stringInputMsg model.name }
            , Cmd.none
            )

        UpdateExpirationMonth numberInputMsg ->
            ( { model | expirationMonth = updateNumberInput numberInputMsg model.expirationMonth }
            , Cmd.none
            )

        UpdateExpirationYear numberInputMsg ->
            ( { model | expirationYear = updateNumberInput numberInputMsg model.expirationYear }
            , Cmd.none
            )

        UpdateCCV numberInputMsg ->
            let
                updatedCcv =
                    updateNumberInput numberInputMsg model.ccv
            in
                ( { model | ccv = updatedCcv }
                , Task.succeed updatedCcv.hasFocus |> Task.perform (\_ -> NoOp) Flip
                )

        Flip flipped ->
            if Helper.cardInfo model |> .ccvPosition |> (==) Front then
                ( model, Cmd.none )
            else
                ( { model | flipped = Just flipped }, Cmd.none )


updateNumber : NumberInput.Msg -> Model Msg -> Model Msg
updateNumber numberInputMsg model =
    let
        newField =
            updateNumberInput numberInputMsg model.number

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


updateStringInput : StringInput.Msg -> Field String -> Field String
updateStringInput stringInputMsg field =
    let
        toField stringInputModel =
            { field
                | value = Just stringInputModel.value
                , hasFocus = stringInputModel.hasFocus
            }
    in
        field
            |> toStringInputModel
            |> StringInput.update stringInputMsg
            |> toField


updateNumberInput : NumberInput.Msg -> Field Int -> Field Int
updateNumberInput numberInputMsg field =
    let
        toField numberInputModel =
            { field
                | value = numberInputModel.value |> String.toInt |> Result.toMaybe
                , hasFocus = numberInputModel.hasFocus
            }
    in
        field
            |> toNumberInputModel
            |> NumberInput.update numberInputMsg
            |> toField


toNumberInputModel : Field Int -> NumberInput.Model
toNumberInputModel field =
    { value = field.value |> Maybe.map toString |> Maybe.withDefault "", hasFocus = field.hasFocus }


toStringInputModel : Field String -> StringInput.Model
toStringInputModel field =
    { value = field.value |> Maybe.withDefault "", hasFocus = field.hasFocus }
