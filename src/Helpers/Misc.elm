module Helpers.Misc
    exposing
        ( onKeyDown
        , partition
        , partitionStep
        , printNumber
        , rightPad
        , leftPad
        , formatNumber
        , transitionAnimation
        )

import Html.Events exposing (on, keyCode)
import String
import Html exposing (Attribute, Html, input)
import Svg
import Json.Decode as Json
import Svg.Attributes exposing (style)


onKeyDown : (Int -> msg) -> Attribute msg
onKeyDown tagger =
    on "keydown" (Json.map tagger keyCode)


{-| Split list into groups of `groupSize`.
-}
partition : Int -> List a -> List (List a)
partition groupSize xs =
    partitionStep groupSize groupSize xs


{-| Split list into groups of `groupSize`. Move the head of each group by `step`.
-}
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


printNumber : Int -> Char -> Maybe Int -> String
printNumber length char maybeNumber =
    maybeNumber
        |> Maybe.map toString
        |> Maybe.withDefault ""
        |> formatNumber length char


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


formatNumber : Int -> Char -> String -> String
formatNumber length char number =
    number
        |> rightPad char length
        |> String.toList
        |> partition 4
        |> List.map ((::) ' ')
        |> List.concat
        |> String.fromList


transitionAnimation : Svg.Attribute msg
transitionAnimation =
    style "transition: fill 0.5s ease"
