# Pretty Card Form

Pretty credit card input form inspired by https://github.com/jessepollak/card 

Everything is written in Elm without any external javascript, and css.
The credit card is created with elm svg renderer.

## Example
TBA

## Usage

To use this component, just include this component in your view and update as part of your Elm Architecture.
```haskell
import Card 

view model = 
    div [] [ Html.map CardUpdate Card.view ]
    
update msg model =
    case msg of
        CardUpdate cardMsg ->
            ...
```

## Options
TBA

## Style
TBA

## License

The MIT License (MIT)
Copyright &copy; 2016 Abadi Kurniawan