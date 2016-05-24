module Test.CardAnimation exposing (..)

import Html exposing (Html, button, div, text, form)
import Html.Attributes exposing (type')
import Html.Events exposing (onClick)
import Html.App as App
import Svg exposing (svg, rect, text', foreignObject, defs, g)
import Svg.Attributes as Attributes exposing (id, style, viewBox, x, y, width, height, rx, ry, fill)


type alias Model =
    { isFlipped : Bool }


init : Model
init =
    { isFlipped = False }


main : Program Never
main =
    App.beginnerProgram { model = init, view = view, update = update }


flipStyle : Model -> Svg.Attribute Msg
flipStyle model =
    style
        (if model.isFlipped then
            "transition: transform 0.5s; transform-origin: 50% 50%; transform: rotateY(180deg); perspective"
         else
            "transition: transform 0.5s;"
        )


view : Model -> Html Msg
view model =
    div [ style "perspective: 1200px;" ]
        [ svg
            [ width "390"
            , height "260"
            , viewBox "0 0 390 260"
            , flipStyle model
            ]
            [ g [ id "elmCardSvg" ]
                [ rect [ x "20", y "20", width "350", height "220", rx "5", ry "5", fill "gray" ] []
                , Svg.text' [ x "200", y "160", fill "white" ] [ Svg.text "TEXT" ]
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
            { model | isFlipped = not model.isFlipped } |> Debug.log ""
