
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
        $scope.result = false;

        $scope.wordLength = $scope.word.length;
        for (i = 0 ; i < $scope.wordLength ; i++)
        {
            $scope.letters.push($scope.word[i]);
            $scope.status.push(initialStatus);
            $scope.input.push(initialChar);
        }
        $scope.pointer = 0;
    }

    $scope.changeWord = function()
    {
        $scope.word        = 'geel';
        $scope.translation = 'yellow';
        $scope.meanings    = [];
        initializeWord();
    }

    function movePointer(up)
    {
        if (up && $scope.pointer < $scope.wordLength-1)
        {
            ++$scope.pointer;
        }
        else if (!up && $scope.pointer > 0)
        {
            --$scope.pointer;
        }
    }

    $scope.pointerUp = function()
    {
        movePointer(true);
    }
    
    $scope.pointerDown = function() {
        movePointer(false);
    }

    $scope.updChar = function(charCode)
    {
        pos = $scope.pointer;
        if ($scope.status[pos] != H)
        {
            $scope.input[pos] = String.fromCharCode(charCode + 32);
            var newStatus = $scope.input[pos] == $scope.letters[pos]
                ? C
                : I;
            $scope.status[pos] = newStatus;
        }
        $scope.pointerUp();
    }
      
    $scope.resetWord = function()
    {
        for (i = 0 ; i < $scope.wordLength ; i++)
        {
            if ($scope.status[i] != H)
            {
                $scope.input[i] = initialChar;
                $scope.status[i] = E;
            }
        }
        $scope.pointer = 0;
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
            $scope.pointer = pos+1;
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

    $scope.getCharSelected = function (idx)
    {
        return (idx === $scope.pointer && !$scope.result) ? 'selected' : '';
    }

    $(document).keydown(function(e){

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
        else if (!$scope.result)
        {
            if (charCode >= 65 && charCode <= 90
                //|| charCode >= 97 && charCode <= 122
            )
            {
                $scope.updChar(charCode);
            }
            else if (charCode == 8) // Backspace
            {
                pos = $scope.pointer;
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
        }
        $scope.checkResult();
        $scope.$apply();
    });
}
