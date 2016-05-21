module Update exposing (..)

{-| Update
-}

import Components.NumberInput as NumberInput
import Model exposing (Model, Field)
import String
import Helpers.CardType as CardType


type Msg
    = NoOp
    | UpdateNumber NumberInput.Msg
    | UpdateName String
    | UpdateExpirationMonth NumberInput.Msg
    | UpdateExpirationYear NumberInput.Msg
    | UpdateCCV NumberInput.Msg


update : Msg -> Model Msg -> ( Model Msg, Cmd Msg )
update msg model =
    case msg of
        NoOp ->
            ( model, Cmd.none )

        UpdateNumber numberInputMsg ->
            ( updateNumber numberInputMsg model
            , Cmd.none
            )

        UpdateName name ->
            ( { model | name = updateFieldValue (Just name) model.name }
            , Cmd.none
            )

        UpdateExpirationMonth numberInputMsg ->
            ( { model | expirationMonth = updateFieldValue (updateNumberInput numberInputMsg model.expirationMonth) model.expirationMonth }
            , Cmd.none
            )

        UpdateExpirationYear numberInputMsg ->
            ( { model | expirationYear = updateFieldValue (updateNumberInput numberInputMsg model.expirationYear) model.expirationYear }
            , Cmd.none
            )

        UpdateCCV numberInputMsg ->
            ( { model | ccv = updateFieldValue (updateNumberInput numberInputMsg model.ccv) model.ccv }
            , Cmd.none
            )


updateNumber : NumberInput.Msg -> Model Msg -> Model Msg
updateNumber numberInputMsg model =
    let
        newNumber =
            updateFieldValue (updateNumberInput numberInputMsg model.number) model.number

        modelWithUpdatedNumber =
            { model | number = newNumber }

        cardInfo =
            CardType.detect modelWithUpdatedNumber

        modelWithUpdatedCardInfo =
            { modelWithUpdatedNumber | cardInfo = cardInfo }
    in
        modelWithUpdatedCardInfo


updateFieldValue : Maybe a -> Field a -> Field a
updateFieldValue newValue field =
    { field | value = newValue }


updateNumberInput : NumberInput.Msg -> Field Int -> Maybe Int
updateNumberInput numberInputMsg field =
    field.value
        |> Maybe.map toString
        |> Maybe.withDefault ""
        |> NumberInput.update numberInputMsg
        |> String.toInt
        |> Result.toMaybe
