module Helper exposing (onKeyDown)

import Html.Events exposing (on, keyCode)
import Html exposing (Attribute, Html, input)
import Json.Decode as Json


onKeyDown : (Int -> msg) -> Attribute msg
onKeyDown tagger =
    on "keydown" (Json.map tagger keyCode)
