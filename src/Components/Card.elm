module Components.Card exposing (viewCard)

import Html exposing (Html)
import Html.Attributes exposing (style)
import Model exposing (Model)
import Update exposing (Msg)
import Svg exposing (svg, rect, text', text, foreignObject)
import Svg.Attributes exposing (width, height, viewBox, x, y, rx, ry, fill, fontSize, fontFamily)
import Components.Logo exposing (viewLogo)
import Helper exposing (printNumber, rightPad)
import String


viewCard : Model -> Html Msg
viewCard model =
    let
        number =
            printNumber model.options.maxNumberLength
                model.options.blankChar
                model.number.value

        blankName =
            "YOUR NAME"

        name =
            model.name.value
                |> Maybe.map String.toUpper
                |> Maybe.withDefault ""
                |> (\name ->
                        if String.isEmpty name then
                            blankName
                        else
                            name
                   )

        expirationMonth =
            model.expirationMonth.value
                |> Maybe.map toString
                |> Maybe.withDefault ""
                |> rightPad model.options.blankChar 2

        expirationYear =
            model.expirationYear.value
                |> Maybe.map toString
                |> Maybe.withDefault ""
                |> rightPad model.options.blankChar 4
    in
        svg [ width "350", height "220", viewBox "0 0 350 220", fontFamily "monospace" ]
            [ rect [ x "0", y "0", width "350", height "220", rx "5", ry "5", fill "rgba(0, 0, 0, 0.4)" ] []
            , viewLogo model
            , text' [ x "40", y "110", fontSize "22", fill model.styles.textColor ] [ text number ]
            , foreignObject [ x "40", y "160", fontSize "16", width "170", fill model.styles.textColor ]
                [ Html.p [ style [ ( "color", model.styles.textColor ) ] ]
                    [ Html.text name ]
                ]
            , text' [ x "250", y "160", fontSize "10", fill model.styles.lightTextColor ] [ text "MONTH/YEAR" ]
            , text' [ x "215", y "170", fontSize "8", fill model.styles.lightTextColor ] [ text "valid" ]
            , text' [ x "220", y "180", fontSize "8", fill model.styles.lightTextColor ] [ text "thru" ]
            , text' [ x "250", y "180", fontSize "14", fill model.styles.textColor ] [ text (expirationMonth ++ "/" ++ expirationYear) ]
            ]
