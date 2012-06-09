
function WordCtrl($scope)
{

    $scope.word        = 'lekker';
    $scope.translation = 'nice';
    $scope.meanings    = ['delicious', 'tasty'];

    var E = 'empty';
    var C = 'correct';
    var I = 'incorrect';
    var H = 'hint';

    var initialChar   = '·';
    var initialStatus = E;

    function initializeWord ()
    {
        $scope.letters = new Array();
        $scope.status  = new Array();
        $scope.input   = new Array();
        $scope.pointer = new Array();
        $scope.result = false;

        $scope.wordLength = $scope.word.length;
        for (i = 0 ; i < $scope.wordLength ; i++)
        {
            $scope.letters.push($scope.word[i]);
            $scope.status.push(initialStatus);
            $scope.input.push(initialChar);
            $scope.pointer.push(false);
        }
        $scope.pointer[0] = true;
    }

    $scope.changeWord = function()
    {
        $scope.word        = 'geel';
        $scope.translation = 'yellow';
        $scope.meanings    = [];
        initializeWord();
    }

    initializeWord();

    function getPointer()
    {
        var pos = -1;
        for (i = 0 ; i < $scope.wordLength ; i++)
        {
            if ($scope.pointer[i]=== true)
            {
                pos = i;
                break;
            }
        }
        return pos;
    }

    function movePointer(pos, up)
    {
      
        $scope.pointer[pos]   = false;
        var newpos = up
            ? pos+1
            : pos-1;
        if ( newpos < 0 ) { newpos = 0; }
        else if ( newpos >= $scope.wordLength ) { newpos = $scope.wordLength-1; }
        $scope.pointer[newpos] = true;
    }

    $scope.pointerUp = function(pos)
    {
        movePointer(pos, true);
    }
    
    $scope.pointerDown = function(pos) {
        movePointer(pos, false);
    }

    $scope.updChar = function(pos, charCode)
    {
        if ($scope.status[pos] != H)
        {
            $scope.input[pos] = String.fromCharCode(charCode + 32);
            var newStatus = $scope.input[pos] == $scope.letters[pos]
                ? C
                : I;
            $scope.status[pos] = newStatus;
        }
        $scope.pointerUp(pos);
    }
      
    $scope.resetWord = function()
    {
        for (i = 0 ; i < $scope.wordLength ; i++)
        {
            $scope.pointer[i] = false;
            if ($scope.status[i] != H)
            {
                $scope.input[i] = initialChar;
                $scope.status[i] = E;
            }
        }
        $scope.pointer[0] = true;
    }
      
    $scope.hintLetter = function()
    {
        var i = 3;
        $scope.input[i] = $scope.letters[i];
        $scope.status[i] = H;
    }

    $scope.checkResult = function ()
    {
        hits = 0;
        for (i = 0 ; i < $scope.wordLength ; i++)
        {
            if ($scope.status[i] == C
                || $scope.status[i] == H
            )
            {
                ++hits;
            }
        }
        if (hits == $scope.wordLength)
        {
            $scope.result = true;
        }
    }

    $(document).keydown(function(e){
        pos = getPointer();

        var charCode = (typeof e.which == "number") ? e.which : e.keyCode
        if (e.shiftKey === true && charCode == 72)
        {
            $scope.hintLetter();
        }
        else if (charCode >= 65 && charCode <= 90
            //|| charCode >= 97 && charCode <= 122
        )
        {
            $scope.updChar(pos, charCode);
            $scope.checkResult();
        }
        else if (charCode == 8) // Backspace
        {
            if ($scope.status[pos] != H)
            {
                $scope.input[pos] = initialChar;
                $scope.status[pos] = E;
            }
            $scope.pointerDown(pos);
        }
        else if (charCode == 32) // Space
        {
            $scope.resetWord();
        }
        $scope.$apply();
    });
}
