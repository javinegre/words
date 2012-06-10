
function WordCtrl($scope)
{

    $scope.wordsList   = [];
    $scope.solvedWords = [];

    $scope.word        = '';
    $scope.translation = '';
    $scope.meanings    = [];

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
        var pos = -1;
        for (i = 0 ; i < $scope.wordLength ; i++)
        {
            if ($scope.status[i]== E
                || $scope.status[i] == I
            )
            {
                pos = i;
                break;
            }
        }
        if (pos >= 0)
        {
            $scope.input[pos] = $scope.letters[pos];
            $scope.status[pos] = H;
        }
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

    $scope.getWords = function()
    {
        $scope.wordsList = serverData;
        $scope.solvedWords = [];
        $scope.newWord();
    }

    $scope.newWord = function ()
    {
        if ($scope.wordsList.length > 0)
        {
            var newWord = $scope.wordsList.pop();
            $scope.word        = newWord.w;
            $scope.translation = newWord.t;
            $scope.meanings    = newWord.m;
            initializeWord();
        }
        else
        {
            $scope.word        = '';
            $scope.translation = '';
            $scope.meanings    = [];
        }
    }

    $scope.nextWord = function ()
    {
        $scope.solvedWords.push([$scope.translation, $scope.word]);
        $scope.newWord();
    }

    $(document).keydown(function(e){
        pos = getPointer();

        var charCode = (typeof e.which == "number") ? e.which : e.keyCode

        // Shortcuts
        if (e.shiftKey === true)
        {
            // [shift + H]
            if (charCode == 72)
            {
                $scope.hintLetter();
            }
            // [shift + N]
            else if (charCode == 78)
            {
                $scope.nextWord();
            }
        }
        else
        {
            if (charCode >= 65 && charCode <= 90
                //|| charCode >= 97 && charCode <= 122
            )
            {
                $scope.updChar(pos, charCode);
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
            $scope.checkResult();
        }
        $scope.$apply();
    });
}
