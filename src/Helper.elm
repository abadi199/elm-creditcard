module Helper
    exposing
        ( onKeyDown
        , partition
        , partitionStep
        , printNumber
        , rightPad
        , formatNumber
        )

import Html.Events exposing (on, keyCode)
import String
import Html exposing (Attribute, Html, input)
import Json.Decode as Json


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


printNumber : Int -> Maybe Int -> String
printNumber length maybeNumber =
    maybeNumber
        |> Maybe.map toString
        |> Maybe.withDefault ""
        |> formatNumber length


rightPad : Char -> Int -> String -> String
rightPad char length number =
    if String.length number < length then
        rightPad char length (number ++ String.fromChar char)
    else
        number


formatNumber : Int -> String -> String
formatNumber length number =
    number
        |> rightPad '•' length
        |> String.toList
        |> partition 4
        |> List.map ((::) ' ')
        |> List.concat
        |> String.fromList
