module.exports = {

    //formats the title search result
    //returns html code
    title_table: function (sql_result) {
        let type_list = [
            "short", "movie", "tvMovie", "tvSeries", "tvShort", "tvMiniSeries", "tvSpecial", "videoGame"
        ];

        let option_list = "";
        for (let i = 0; i < type_list.length; i++) {
            option_list += '<option value=\"' + type_list[i] + '\">' + type_list[i] + '</option>';
        }

        let table_html_code =
            '<table class="table">' +
            '<thead class="thead-dark">' +
            '<tr>' +
            '<th scope="col">Number</th>' +
            '<th scope="col">Title</th>' +
            '<th scope="col">Type</th>' +
            '<th scope="col">Started Year</th>' +
            '<th scope="col">Ended Year</th>' +
            '</tr>' +
            '</thead>' + '<select id="select_type">' +
            '<option value="all" selected>all</option>'+
            option_list + '</select>' +
            "<button onclick=\"title_filter();\">show</button>" +
            '<tbody>';

        //the title result will be sorted based on their start years, from newest
        sql_result.sort((a, b) => {
            return parseInt(b.start_year) - parseInt(a.start_year);
        });


        for (let i = 0; i < sql_result.length; i++) {
            let end_year;
            if (sql_result[i].end_year === null) {
                end_year = '-';
            } else {
                end_year = sql_result[i].end_year;
            }

            table_html_code += '<tr>' +
                '<th >' + (i + 1) + '</th>' +
                '<td>' +
                //'<a href=\"' + main_page + '/individual?tconst=' + sql_result[i].tconst + '\" class=\"list-group-item-action \">' +
                '<a href="/individual/' + sql_result[i].tconst +'">' + sql_result[i].primary_title + '</a>' + '</td>' +
                '<td class="title_type">' + sql_result[i].title_type + '</td>' +
                '<td>' + sql_result[i].start_year + '</td>' +
                '<td>' + end_year + '</td>' +
                '</tr>';
        }

        table_html_code += "</tbody></table>";

        return table_html_code;
    },

    //formats the people search result
    //returns html code
    people_table: function (sql_result) {
        let table_html_code = "";

        let pro_list = ['actor',
            'actress', 'animation_department', 'art_department',
            'art_director', 'assistant', 'assistant_director',
            'camera_department', 'casting_department', 'casting_director',
            'cinematographer', 'composer', 'costume_department',
            'costume_designer', 'director', 'editor',
            'editorial_department', 'executive', 'legal',
            'location_management', 'make_up_department', 'manager',
            'miscellaneous', 'music_department', 'producer',
            'production_designer', 'production_manager', 'publicist',
            'set_decorator', 'sound_department', 'soundtrack',
            'special_effects', 'stunts', 'talent_agent',
            'transportation_department', 'visual_effects', 'writer'
        ];

        let option_list = "";
        for (let i = 0; i < pro_list.length; i++) {
            option_list += '<option value=\"' + pro_list[i] + '\">' + pro_list[i] + '</option>';
        }

        table_html_code = '<table class="table">' +
            '<thead class="thead-dark">' +
            '<tr>' +
            '<th scope="col">Number</th>' +
            '<th scope="col">Name</th>' +
            '<th scope="col">Birth Year</th>' +
            '<th scope="col">Death Year</th>' +
            '<th scope="col">Profession</th>' +
            '</tr>' +
            '</thead>' + '<select id="select_pro">' +
            '<option value="all">all</option>' +
            '<option value="">(no profession)</option>' +
            option_list +
            '</select>' +
            "<button onclick=\"name_filter();\">show</button>" +
            '<tbody>';

        for (let i = 0; i < sql_result.length; i++) {
            let death_year;
            if (sql_result[i].death_year === null) {
                death_year = 'present';
            } else {
                death_year = sql_result[i].death_year;
            }

            table_html_code += '<tr>' +
                '<th scope="row">' + (i + 1) + '</th>' +
                '<td>' +
                //'<a href=\"' + main_page + '/individual?nconst=' + sql_result[i].nconst + '\" class=\"list-group-item-action \">' +
                '<a href="/individual/' + sql_result[i].nconst + '">' + sql_result[i].primary_name + '</a>' + '</td>' +
                '<td>' + sql_result[i].birth_year + '</td>' +
                '<td>' + death_year + '</td>' +
                '<td class="person_pro">' + sql_result[i].primary_profession + '</td>' +
                '</tr>';
        }

        table_html_code += "</tbody></table>";

        return table_html_code;
    },

    //formats the single title page
    //returns object with html_code, directors_sql, writers_sql
    title_individual: function (sql_result) {
        let returnObj = {};

        let writers_sql = "";
        let directors_sql = "";
        let writers_arr = [];
        let directors_arr =[];

        let html_code = '<div id="table">';

        html_code += '<h2>' + sql_result[0].primary_title + '' +
            '<span onclick="editing_movie()">&nbsp;&nbsp;&nbsp;&nbsp;edit</span></h2>';

        let end_year;
        if (sql_result[0].end_year === null) {
            end_year = '-';
        } else {
            end_year = sql_result[0].end_year;
        }

        directors_arr = sql_result[0].directors.split(',');
        directors_sql = "SELECT primary_name, nconst FROM Names WHERE ";

        for (let i = 0; i < directors_arr.length; i++) {
            directors_sql += "nconst = \"" + directors_arr[i] + "\" ";

            if (i < directors_arr.length - 1) {
                directors_sql += "OR ";
            }
        }

        if (sql_result[0].writers !== null) {

            writers_arr = sql_result[0].writers.split(',');
            writers_sql = "SELECT primary_name, nconst FROM Names WHERE ";
            for (let i = 0; i < writers_arr.length; i++) {
                writers_sql += "nconst = \"" + writers_arr[i] + "\" ";

                if (i < writers_arr.length - 1) {
                    writers_sql += "OR ";
                }
            }
        } else {
            writers_sql = "";
        }

        html_code += '<div class="row">' +
            '<div class="col-3">' +
            '<p id="tconst_hidden" hidden>' + sql_result[0].tconst + '</p>' +
            //movie info here
            '<p>Movie type: <span id="movie_type">' + sql_result[0].title_type + '</p>' +
            '<p>Start year: ' + sql_result[0].start_year + '</p>' +
            '<p>End year: ' + end_year + '</p>' +
            '<p>Length: ' + sql_result[0].runtime_minutes + ' minutes</p>' +
            '<p>Genres: <span id="movie_genres">' + sql_result[0].genres + '</span></p>' +
            '<p>Average rating: ' + sql_result[0].average_rating + '</p>' +
            '<p>Number of votes: ' + sql_result[0].num_votes + '</p>';

        html_code += "<h5>Casting (order by top billed cast): </h5><ol id='cast_list'>";

        for (let i = 0; i < sql_result.length; i++) {
            html_code += "<li><a href=\"/individual/" + sql_result[i].nconst +
                "\">" + sql_result[i].primary_name + "</a></li>";
        }

        html_code += "</ol></div>";

        html_code += "<div class=\"col-3\"><h5>Directors: ***directors***</h5></div>";

        html_code += "<div class=\"col-3\"><h5>Writers: ***writers***</h5></div>";

        //dont forget poster here
        html_code += '<div class=\"col-3\" ng-controller=\"PosterController\">' +
            //movie picture here
            '<img ng-src=\"{{imageSrc}}\" ng-init=\"imageSrc = \'./img/poster-placeholder.jpg\'\">' + '</div>';

        html_code +='</div>' + '</div>' + '</div>';

        returnObj.html_code = html_code;
        returnObj.directors_sql = directors_sql;
        returnObj.writers_sql = writers_sql;
        return returnObj;
    },

    //formats the single person page
    //returns object with html_code and titles_name_sql
    people_individual: function (sql_result){
        let return_obj = {};

        let html_code = "<div id='table'>";

        html_code += "<h2>" + sql_result.primary_name + '' +
            '<span onclick="editing_person()">&nbsp;&nbsp;&nbsp;&nbsp;edit</span></h2>';

        let death_year;
        if (sql_result.death_year === null) {
            death_year = 'present';
        } else {
            death_year = sql_result.death_year;
        }

        let known_titles_arr = sql_result.known_for_titles.split(',');
        let titles_name_sql = "SELECT Titles.primary_title, Titles.tconst From Titles WHERE ";
        for (let i = 0; i < known_titles_arr.length; i++) {
            titles_name_sql += "tconst = \"" + known_titles_arr[i] + "\" ";

            if (i < known_titles_arr.length - 1) {
                titles_name_sql += "OR ";
            }
        }

        html_code += '<div class="row">' +
        '<div class="col-4">' +
        // info here
        '<p id="nconst_hidden" hidden>' + sql_result.nconst + '</p>' +
        '<p>Birth Year: ' + '<span id="person_birth_year">' + sql_result.birth_year + '</span></p>' +
        '<p>Death Year: ' + '<span id="person_death_year">' + death_year + '</span></p>' +
        '<p>Professions: ' + '<span id="person_profession">' + sql_result.primary_profession + '</span></p>' +
        '</div><div class="col-4"><h5>Known For Titles</h5>' +
        '***known_titles***' +
        '</div> ' +
        '<div class="col-4" ng-controller=\"PosterController\">';

        //poster here

        html_code +='</div>' + '</div>' + '</div>';

        return_obj.html_code = html_code;
        return_obj.titles_name_sql = titles_name_sql;

        return return_obj;
    },

    //formats the list of people's name in titles' page
    //returns html code
    people_list: function(sql_result){
        var html_code = "<ul style='list-style-type: none'>";

        for (var i = 0; i < sql_result.length; i++) {
            html_code += "<li><a href=\"/individual/" +
                sql_result[i].nconst + "\">" +
                sql_result[i].primary_name + "</a></li>";
        }

        html_code += "</ul>";

        return html_code;
    },

    //formats the list of titles' name in people's page
    //returns html code
    title_list: function (sql_result) {
        var html_code = "<ul style='list-style-type: none'>";

        for (var i = 0; i < sql_result.length; i++) {
            html_code += "<li><a href=\"/individual/" +
                sql_result[i].tconst + "\">" +
                sql_result[i].primary_title + "</a></li>";
        }

        html_code += "</ul>";

        return html_code;
    }
};