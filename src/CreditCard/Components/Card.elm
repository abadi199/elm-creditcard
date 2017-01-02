module CreditCard.Components.Card exposing (card)

import CreditCard.Internal exposing (CardInfo, CardData, InternalState, getStateValue)
import CreditCard.Config exposing (Config)
import Html exposing (Html, div)
import Html.Attributes exposing (style)
import Svg exposing (svg, rect, text_, text, foreignObject, defs, g)
import Svg.Attributes as Attributes exposing (transform, id, width, height, viewBox, x, y, rx, ry, fill, fontSize, fontFamily)
import CreditCard.Components.Logo
import Helpers.Misc as Helper exposing (printNumber, rightPad, leftPad)
import String
import CreditCard.Components.Chip exposing (viewChip, viewChipAlt)
import Helpers.CardAnimation exposing (flipAnimation, backsideAnimation, keyframeAnimationDefs)
import CreditCard.Components.BackCard exposing (viewBackCard)


card : Config -> CardInfo msg -> CardData model -> Html msg
card config cardInfo cardData =
    let
        number =
            printNumber cardInfo.numberFormat
                minNumberLength
                config.blankChar
                cardData.number

        ( minNumberLength, maxNumberLength ) =
            Helper.minMaxNumberLength cardInfo

        blankName =
            config.blankName

        name =
            cardData.name
                |> Maybe.map String.toUpper
                |> Maybe.withDefault ""
                |> (\name ->
                        if String.isEmpty name then
                            blankName
                        else
                            name
                   )

        blankMonth =
            List.repeat 2 config.blankChar
                |> String.fromList

        expirationMonth =
            cardData.month
                |> Maybe.withDefault ""
                |> (\str ->
                        if String.isEmpty str then
                            blankMonth
                        else
                            leftPad '0' 2 str
                   )

        expirationYear =
            cardData.year
                |> Maybe.withDefault ""
                |> rightPad config.blankChar 4

        cardStyle =
            cardInfo.cardStyle

        numberLength =
            cardData.number
                |> Maybe.map String.length
                |> Maybe.withDefault 0

        numberFontSize =
            if numberLength > 16 then
                fontSize "20"
            else
                fontSize "22"

        ccv =
            cardData.ccv
                |> Maybe.withDefault "CCV"

        stateValue =
            getStateValue cardData.state
    in
        div
            [ Html.Attributes.class "elm-card-svg"
            , Html.Attributes.style [ ( "perspective", "1200px" ) ]
            ]
            [ svg
                [ width "350"
                , height "220"
                , viewBox "0 0 350 220"
                , fontFamily "monospace"
                , flipAnimation stateValue.flipped
                ]
                [ keyframeAnimationDefs
                , g [ id "elmCardSvgFront" ]
                    (List.append
                        [ defs [] cardStyle.background.defs
                        , rect (List.append [ x "0", y "0", width "350", height "220", rx "5", ry "5" ] cardStyle.background.attributes) []
                        ]
                        cardStyle.background.svg
                        |> flip List.append
                            [ viewChip 40 70
                            , CreditCard.Components.Logo.viewLogo config cardInfo
                            , text_ [ x "40", y "130", numberFontSize, fill cardStyle.textColor ] [ text number ]
                            , foreignObject [ x "40", y "160", fontSize "16", width "170", fill cardStyle.textColor ]
                                [ Html.p [ style [ ( "color", cardStyle.textColor ) ] ]
                                    [ Html.text name ]
                                ]
                            , text_ [ x "250", y "160", fontSize "10", fill cardStyle.lightTextColor ] [ text "MONTH/YEAR" ]
                            , text_ [ x "215", y "170", fontSize "8", fill cardStyle.lightTextColor ] [ text "valid" ]
                            , text_ [ x "220", y "180", fontSize "8", fill cardStyle.lightTextColor ] [ text "thru" ]
                            , text_ [ x "250", y "180", fontSize "14", fill cardStyle.textColor ] [ text (expirationMonth ++ "/" ++ expirationYear) ]
                            , (if (cardInfo.ccvPosition == CreditCard.Internal.Front) then
                                text_ [ x "290", y "110", fontSize "14", fill cardStyle.darkTextColor ] [ text ccv ]
                               else
                                text ""
                              )
                            ]
                    )
                , viewBackCard cardInfo cardData
                ]
            ]
