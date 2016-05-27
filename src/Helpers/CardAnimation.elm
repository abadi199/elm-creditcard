module Helpers.CardAnimation
    exposing
        ( flipAnimation
        , backsideAnimation
        , keyframeAnimationDefs
        , transitionAnimation
        )

import Svg exposing (Svg, Attribute, defs, text)
import Svg.Attributes as Attributes exposing (style)


flipAnimation : Maybe Bool -> Attribute msg
flipAnimation flipped =
    if flipped |> Maybe.withDefault False then
        style "transition: transform 0.5s; transform-origin: 50% 50%; transform: rotateY(180deg);"
    else
        style "transition: transform 0.5s;"


backsideAnimation : Maybe Bool -> Attribute msg
backsideAnimation flipped =
    case flipped of
        Nothing ->
            style "transform: rotateY(180deg); transform-origin: 175px 110px; opacity: 0;"

        Just isFlipped ->
            if isFlipped then
                style "transform: rotateY(180deg); transform-origin: 175px 110px; animation: show 0.175s 1 steps(1); opacity: 1;"
            else
                style "transform: rotateY(180deg); transform-origin: 175px 110px; animation: hide 0.125s 1 steps(1); opacity: 0;"


keyframeAnimationDefs : Svg msg
keyframeAnimationDefs =
    defs []
        [ Svg.style []
            [ text """@keyframes show {
                        0% { opacity: 0; }
                        100% { opacity: 1; }
                        }
                        @keyframes hide {
                        0% { opacity: 1; }
                        100% { opacity: 0; }
                        }"""
            ]
        ]


transitionAnimation : Svg.Attribute msg
transitionAnimation =
    style "transition: fill 0.5s ease"
