module Model exposing (Model, Options, Field, Styles, init)

{-| Model
-}


type alias Model =
    { options : Options
    , number : Field Int
    , name : Field String
    , expirationMonth : Field Int
    , expirationYear : Field Int
    , ccv : Field Int
    , styles : Styles
    }


type alias Options =
    { showLabel : Bool
    , maxNumberLength : Int
    , blankChar : Char
    }


type alias Field a =
    { id : String
    , label : Maybe String
    , value : Maybe a
    }


type alias Styles =
    { textColor : String }


{-| init
-}
init : Model
init =
    { options = { showLabel = False, maxNumberLength = 16, blankChar = '•' }
    , number = { id = "", label = Just "CC Number", value = Nothing }
    , name = { id = "", label = Just "Full Name", value = Nothing }
    , expirationMonth = { id = "", label = Just "MM", value = Nothing }
    , expirationYear = { id = "", label = Just "YYYY", value = Nothing }
    , ccv = { id = "", label = Just "CCV", value = Nothing }
    , styles = { textColor = "rgba(255,255,255,0.7)" }
    }
