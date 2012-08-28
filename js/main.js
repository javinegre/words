
function WordCtrl($scope, $http)
{

    $scope.data_url = './scripts/get_words.php';
    $scope.categories_url = './scripts/get_categories.php';

    $scope.wordsList   = [];
    $scope.solvedWords = [];
    $scope.categories  = [];

    $scope.word        = '';
    $scope.translation = '';
    $scope.meanings    = [];

    var E = 'empty';
    var C = 'correct';
    var I = 'incorrect';
    var H = 'hint';

    var initialChar   = '·';
    var initialStatus = E;

    $scope.getCategories = function()
    {
        $http.get($scope.categories_url).success($scope.handleLoadedCategories);
        //TODO: error handling
    }

    $scope.handleLoadedCategories = function (data, status)
    {
        var datalength = data.length;
        for (var i = 0 ; i < datalength ; ++i)
        {
            $scope.categories.push({name: data[i], active: true});
        }
    }

    $scope.getCategories();
    console.log($scope.categories);

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
        if (up && $scope.pointer < $scope.wordLength)
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

    $scope.handleLoadedWords = function (data, status)
    {
        $scope.wordsList = data;
        $scope.solvedWords = [];
        $scope.newWord();
    }

    $scope.getWordOptions = function()
    {
        // Finds unselected categories
        categories = [];
        catLength = $scope.categories.length;
        for (i = 0 ; i < catLength ; i++)
        {
            category = $scope.categories[i];
            if (!category.active)
            {
                categories.push(category.name);
            }
        }
        // If no category is selected, it uses all categories
        if (categories.length == catLength)
        {
            categories = [];
        }
        options  = 'number=' + 15;
        options += '&minLength=' + 0;
        options += '&maxLength=' + 20;
        options += '&categories=' + categories.join(';');

        return options;
    }

    $scope.getWords = function()
    {
        contentType = {'Content-Type': 'application/x-www-form-urlencoded'};
        $http({method: 'POST', url: $scope.data_url, data: $scope.getWordOptions(), headers: contentType})
            .success($scope.handleLoadedWords);
        //TODO: error handling
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

    $scope.removeChar = function()
    {
        $scope.pointerDown();
        pos = $scope.pointer;
        if ($scope.status[pos] != H
            && $scope.status[pos] != C
        )
        {
            $scope.input[pos] = initialChar;
            $scope.status[pos] = E;
        }
    }

    $scope.endGame = function()
    {

        $scope.wordsList = [];
        $scope.nextWord();
    }

    $scope.printCursor = function(idx)
    {
        return (idx == $scope.pointer);
    }

    $scope.toggleCategory = function (idx)
    {
        $scope.categories[idx].active = !$scope.categories[idx].active;
    }

    $scope.toggleAllCategories = function (status)
    {
        var catlength = $scope.categories.length;
        for (var i = 0 ; i < catlength ; ++i)
        {
            $scope.categories[i].active = status;
        }
    }

    $(document).keydown(function(e){

        e.preventDefault();
        var charCode = (typeof e.which == "number") ? e.which : e.keyCode

        // Quick patch
        // TODO: improve shortcuts
        if ($scope.wordsList.length == 0
            && $scope.word.length == 0
            && charCode == 13
        )
        {
            $scope.getWords();
        }
        // Shortcuts
        else if (e.ctrlKey === true)
        {
            // [Control + Intro]
            if (charCode == 13)
            {
                $scope.nextWord();
            }
        }
        else if ($scope.result)
        {
            if (charCode == 13 // Return
                || charCode == 32 // Space
            )
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
                $scope.updChar(charCode);
            }
            else if (charCode == 9) // [TAB]
            {
                $scope.hintLetter();
            }
            else if (charCode == 8) // Backspace
            {
                $scope.removeChar();
            }
            else if (charCode == 32) // Space
            {
                $scope.resetWord();
            }
            else if (charCode == 37) // Left arrow
            {
                $scope.pointerDown();
            }
            else if (charCode == 39) // Right arrow
            {
                $scope.pointerUp();
            }
            else if (charCode == 27) // Escape
            {
                $scope.endGame();
            }
        }
        $scope.checkResult();
        $scope.$apply();
    });
}
