module Components.Card exposing (viewCard)

import Html exposing (Html)
import Model exposing (Model)
import Update exposing (Msg)
import Svg exposing (svg, rect, text')
import Svg.Attributes exposing (width, height, viewBox, x, y, rx, ry, fill, fontSize, fontFamily)
import Components.Logo exposing (viewLogo)
import Helper exposing (printNumber)


viewCard : Model -> Html Msg
viewCard model =
    svg [ width "350", height "220", viewBox "0 0 350 220", fontFamily "monospace" ]
        [ rect [ x "0", y "0", width "350", height "220", rx "5", ry "5", fill "rgba(0, 0, 0, 0.4)" ] []
        , viewLogo model
        , text' [ x "40", y "120", fontSize "24", fill model.styles.textColor ] [ Svg.text (printNumber model.options.maxNumberLength model.number.value) ]
        , text' [ x "40", y "180", fontSize "16", fill model.styles.textColor ] [ Svg.text "ABADI KURNIAWAN" ]
        , text' [ x "240", y "180", fontSize "14", fill model.styles.textColor ] [ Svg.text "11/2019" ]
        ]
