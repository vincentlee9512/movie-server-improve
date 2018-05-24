module.exports = {

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
                '<a>' + sql_result[i].primary_title + '</a>' + '</td>' +
                '<td class="title_type">' + sql_result[i].title_type + '</td>' +
                '<td>' + sql_result[i].start_year + '</td>' +
                '<td>' + end_year + '</td>' +
                '</tr>';
        }

        table_html_code += "</tbody></table>";

        return table_html_code;
    },
    
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
                '<a>' + sql_result[i].primary_name + '</a>' + '</td>' +
                '<td>' + sql_result[i].birth_year + '</td>' +
                '<td>' + death_year + '</td>' +
                '<td class="person_pro">' + sql_result[i].primary_profession + '</td>' +
                '</tr>';
        }

        table_html_code += "</tbody></table>";

        return table_html_code;
    }


};