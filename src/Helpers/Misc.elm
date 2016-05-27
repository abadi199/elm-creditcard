module Helpers.Misc
    exposing
        ( onKeyDown
        , partition
        , partitionStep
        , printNumber
        , rightPad
        , leftPad
        , formatNumber
        , cardInfo
        , minMaxNumberLength
        )

import Html.Events exposing (on, keyCode)
import String
import Html exposing (Attribute, Html, input)
import Json.Decode as Json
import Model exposing (Model, NumberFormat, CardInfo)
import Helpers.CardType exposing (unknownCard)


onKeyDown : (Int -> msg) -> Attribute msg
onKeyDown tagger =
    on "keydown" (Json.map tagger keyCode)


partition : NumberFormat -> List a -> List (List a)
partition numberFormat xs =
    case numberFormat of
        [] ->
            [ xs ]

        n :: tail ->
            List.take n xs :: (partition tail (List.drop n xs))


partition' : Int -> List a -> List (List a)
partition' groupSize xs =
    partitionStep groupSize groupSize xs


partitionStep : Int -> Int -> List a -> List (List a)
partitionStep groupSize step xs =
    let
        group =
            List.take groupSize xs

        xs' =
            List.drop step xs

        okayArgs =
            groupSize > 0 && step > 0

        okayLength =
            groupSize == List.length group
    in
        if okayArgs && okayLength then
            group :: partitionStep groupSize step xs'
        else
            [ group ]


printNumber : NumberFormat -> Int -> Char -> Maybe Int -> String
printNumber numberFormat length char maybeNumber =
    maybeNumber
        |> Maybe.map toString
        |> Maybe.withDefault ""
        |> formatNumber numberFormat length char


rightPad : Char -> Int -> String -> String
rightPad char length number =
    if String.length number < length then
        rightPad char length (number ++ String.fromChar char)
    else
        number


leftPad : Char -> Int -> String -> String
leftPad char length number =
    if String.length number < length then
        rightPad char length (String.fromChar char ++ number)
    else
        number


formatNumber : NumberFormat -> Int -> Char -> String -> String
formatNumber numberFormat length char number =
    number
        |> rightPad char length
        |> String.toList
        |> partition numberFormat
        |> List.map ((::) ' ')
        |> List.concat
        |> String.fromList


minMaxNumberLength : Model msg -> ( Int, Int )
minMaxNumberLength model =
    model
        |> cardInfo
        |> .validLength
        |> \numbers -> ( List.minimum numbers |> Maybe.withDefault 16, List.maximum numbers |> Maybe.withDefault 16 )


cardInfo : Model msg -> CardInfo msg
cardInfo model =
    model.cardInfo |> Maybe.withDefault unknownCard
