module Test.CardAnimation exposing (..)

import Html exposing (Html, button, div, text, form)
import Html.Attributes exposing (type')
import Html.Events exposing (onClick)
import Html.App as App
import Svg exposing (svg, rect, text', foreignObject, defs, g)
import Svg.Attributes as Attributes exposing (id, style, viewBox, x, y, width, height, rx, ry, fill)


type alias Model =
    { isFlipped : Maybe Bool }


init : Model
init =
    { isFlipped = Nothing }


main : Program Never
main =
    App.beginnerProgram { model = init, view = view, update = update }


flipStyle : Model -> Svg.Attribute Msg
flipStyle model =
    if model.isFlipped |> Maybe.withDefault False then
        style "transition: transform 0.5s; transform-origin: 50% 50%; transform: rotateY(180deg);"
    else
        style "transition: transform 0.5s;"


backsideAnimation : Model -> Svg.Attribute Msg
backsideAnimation model =
    case model.isFlipped of
        Nothing ->
            style "transform: rotateY(180deg); transform-origin: 195px 130px; opacity: 0;"

        Just isFlipped ->
            if isFlipped then
                style "transform: rotateY(180deg); transform-origin: 195px 130px; animation: show 0.175s 1 steps(1); opacity: 1;"
            else
                style "transform: rotateY(180deg); transform-origin: 195px 130px; animation: hide 0.125s 1 steps(1); opacity: 0;"


view : Model -> Html Msg
view model =
    div [ style "perspective: 1200px;" ]
        [ svg
            [ width "390"
            , height "260"
            , viewBox "0 0 390 260"
            , flipStyle model
            ]
            [ defs []
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
            , g [ id "elmCardSvg" ]
                [ rect [ x "20", y "20", width "350", height "220", rx "5", ry "5", fill "gray" ] []
                , Svg.text' [ x "200", y "160", fill "white" ] [ Svg.text "FRONT" ]
                ]
            , g [ id "elmCardSvg", backsideAnimation model ]
                [ rect [ x "20", y "20", width "350", height "220", rx "5", ry "5", fill "gray" ]
                    []
                , Svg.text' [ x "100", y "160", fill "white" ] [ Svg.text "BACK" ]
                ]
            ]
        , form [] [ button [ type' "button", onClick Flip ] [ text "Flip" ] ]
        ]


type Msg
    = NoOp
    | Flip


update : Msg -> Model -> Model
update msg model =
    case msg of
        NoOp ->
            model

        Flip ->
            { model | isFlipped = model.isFlipped |> Maybe.withDefault False |> not |> Just } |> Debug.log ""
