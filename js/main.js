
function WordCtrl($scope)
{

    $scope.initialWord = 'prima';

    var E = 'empty';
    var C = 'correct';
    var I = 'incorrect';
    var H = 'hint';

    var initialChar   = '·';
    var initialStatus = E;

    $scope.word    = new Array();
    $scope.status  = new Array();
    $scope.input   = new Array();
    $scope.pointer = new Array();

    function initializeWord ()
    {
        var len = $scope.initialWord.length;
        for (i = 0 ; i < len ; i++)
        {
            $scope.word.push($scope.initialWord[i]);
            $scope.status.push(E);
            $scope.input.push(initialChar);
            $scope.pointer.push(false);
        }
        $scope.pointer[0] = true;
    }

    initializeWord();

    function getPointer()
    {
        len = $scope.word.length;
        var pos = -1;
        for (i = 0 ; i < len ; i++)
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
        else if ( newpos >= len ) { newpos = len-1; }
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
            var newStatus = $scope.input[pos] == $scope.word[pos]
                ? C
                : I;
            $scope.status[pos] = newStatus;
        }
        $scope.pointerUp(pos);
    }
      
    $scope.resetWord = function()
    {
        len = $scope.word.length;
        for (i = 0 ; i < len ; i++)
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
        $scope.input[i] = $scope.word[i];
        $scope.status[i] = H;
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
