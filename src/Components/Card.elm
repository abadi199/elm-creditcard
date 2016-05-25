module Components.Card exposing (viewCard)

import Html exposing (Html, div)
import Html.Attributes exposing (style)
import Model exposing (Model)
import Update exposing (Msg)
import Svg exposing (svg, rect, text', text, foreignObject, defs, g)
import Svg.Attributes as Attributes exposing (transform, id, width, height, viewBox, x, y, rx, ry, fill, fontSize, fontFamily)
import Components.Logo exposing (viewLogo)
import Helpers.Misc as Helper exposing (printNumber, rightPad, leftPad)
import String
import Components.Chip exposing (viewChip, viewChipAlt)
import Helpers.CardAnimation exposing (flipAnimation, backsideAnimation, keyframeAnimationDefs)


viewCard : Model Msg -> Html Msg
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

        blankMonth =
            List.repeat 2 model.options.blankChar
                |> String.fromList

        expirationMonth =
            model.expirationMonth.value
                |> Maybe.map toString
                |> Maybe.withDefault ""
                |> (\str ->
                        if String.isEmpty str then
                            blankMonth
                        else
                            leftPad '0' 2 str
                   )

        expirationYear =
            model.expirationYear.value
                |> Maybe.map toString
                |> Maybe.withDefault ""
                |> rightPad model.options.blankChar 4

        cardStyle =
            model.cardInfo.cardStyle
    in
        div
            [ Html.Attributes.class "elm-card-svg"
            , Html.Attributes.style [ ( "perspective", "1200px" ) ]
            ]
            [ svg
                [ width "390"
                , height "260"
                , viewBox "0 0 390 260"
                , fontFamily "monospace"
                , flipAnimation model.flipped
                ]
                [ keyframeAnimationDefs
                , g [ id "elmCardSvg", transform "translate(20, 20)" ]
                    (List.append
                        [ defs [] cardStyle.background.defs
                        , rect (List.append [ x "0", y "0", width "350", height "220", rx "5", ry "5" ] cardStyle.background.attributes) []
                        ]
                        cardStyle.background.svg
                        |> flip List.append
                            [ viewChip 40 70
                            , viewLogo model
                            , text' [ x "40", y "130", fontSize "22", fill cardStyle.textColor ] [ text number ]
                            , foreignObject [ x "40", y "160", fontSize "16", width "170", fill cardStyle.textColor ]
                                [ Html.p [ style [ ( "color", cardStyle.textColor ) ] ]
                                    [ Html.text name ]
                                ]
                            , text' [ x "250", y "160", fontSize "10", fill cardStyle.lightTextColor ] [ text "MONTH/YEAR" ]
                            , text' [ x "215", y "170", fontSize "8", fill cardStyle.lightTextColor ] [ text "valid" ]
                            , text' [ x "220", y "180", fontSize "8", fill cardStyle.lightTextColor ] [ text "thru" ]
                            , text' [ x "250", y "180", fontSize "14", fill cardStyle.textColor ] [ text (expirationMonth ++ "/" ++ expirationYear) ]
                            ]
                    )
                , g [ id "elmCardSvg", backsideAnimation model.flipped ]
                    [ rect [ x "20", y "20", width "350", height "220", rx "5", ry "5", fill "gray" ]
                        []
                    , Svg.text' [ x "100", y "160", fill "white" ] [ Svg.text "BACK" ]
                    ]
                ]
            ]
