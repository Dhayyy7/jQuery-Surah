$(document).ready(function () {
    // Menampilkan pencarian tersimpan saat halaman dimuat
    showSavedSearches();

    $("#searchBtn").click(function () {
      var surahName = $("#surahName").val().trim();
      if (surahName === "") {
        swal("Peringatan!", "Silakan masukkan nama surah!", "warning");
      } else {
        searchSurah(surahName);
      }
    });

    // Menambahkan event listener untuk tombol hapus pada tabel pencarian tersimpan
    $(document).on("click", ".delete-btn", function () {
      var row = $(this).closest("tr");
      var searchToRemove = row.find(".surah-name").text();
      removeSearch(searchToRemove);
      row.remove();
      swal(
        "Sukses!",
        "Surah telah dihapus dari pencarian tersimpan.",
        "success"
      );
    });

    // Menambahkan event listener untuk nama surah pada tabel pencarian tersimpan
    $(document).on("click", "#savedSearches .surah-name", function () {
      var surahName = $(this).text();
      searchSurah(surahName);
    });

    // Menambahkan event listener untuk tombol simpan pada card info surah
    $(document).on("click", "#saveSearchBtn", function () {
      var surahName = $("#surahInfo").find(".card-title").text();
      saveSearch(surahName);
      showSavedSearches(); // Menampilkan kembali pencarian tersimpan setelah disimpan
      swal("Sukses!", "Surah telah disimpan.", "success");
    });

    function searchSurah(surahName) {
      $.ajax({
        url: "https://raw.githubusercontent.com/penggguna/QuranJSON/master/quran.json",
        dataType: "json",
        success: function (data) {
          var foundSurah = data.filter(function (surah) {
            return surah.name.toLowerCase() === surahName.toLowerCase();
          });

          if (foundSurah.length > 0) {
            var surahInfo = foundSurah[0];
            $("#surahInfo").html(`
                        <div class="card">
                            <div class="card-body d-flex flex-column align-items-center">
                                <h2 class="card-title">${surahInfo.name}</h2>
                                <p class="card-text">Nama Translasi: ${surahInfo.name_translations.en}</p>
                                <p class="card-text">Jumlah Ayat: ${surahInfo.number_of_ayah}</p>
                                <p class="card-text">Nomor Surah: ${surahInfo.number_of_surah}</p>
                                <p class="card-text">Tempat: ${surahInfo.place}</p>
                                <p class="card-text">Tipe: ${surahInfo.type}</p>
                                <audio controls class="mt-3">
                                    <source src="${surahInfo.recitation}" type="audio/mp3">
                                    Your browser does not support the audio element.
                                </audio>
                                <button id="saveSearchBtn" class="btn btn-success mt-3">Simpan</button>
                            </div>
                        </div>

                        `);
          } else {
            $("#surahInfo").html("<p>Surah tidak ditemukan.</p>");
            swal("Peringatan!", "Surah tidak ditemukan.", "warning");
          }
        },
        error: function () {
          $("#surahInfo").html(
            "<p>Terjadi kesalahan saat memuat data surah.</p>"
          );
          swal(
            "Error!",
            "Terjadi kesalahan saat memuat data surah.",
            "error"
          );
        },
      });
    }

    function saveSearch(surahName) {
      var searches =
        JSON.parse(localStorage.getItem("savedSearches")) || [];
      if (!searches.includes(surahName)) {
        searches.push(surahName);
        localStorage.setItem("savedSearches", JSON.stringify(searches));
      } else {
        swal(
          "Peringatan!",
          "Surah ini sudah disimpan sebelumnya!",
          "warning"
        );
      }
    }

    function showSavedSearches() {
      var searches =
        JSON.parse(localStorage.getItem("savedSearches")) || [];
      var tableBody = $("#savedSearches");
      tableBody.empty();
      searches.forEach(function (search) {
        var row = $("<tr>");
        row.append('<td class="surah-name">' + search + "</td>");
        row.append(
          '<td><button class="btn btn-danger btn-sm delete-btn">Hapus</button></td>'
        );
        tableBody.append(row);
      });
    }

    function removeSearch(searchToRemove) {
      var searches =
        JSON.parse(localStorage.getItem("savedSearches")) || [];
      var updatedSearches = searches.filter(function (search) {
        return search !== searchToRemove;
      });
      localStorage.setItem(
        "savedSearches",
        JSON.stringify(updatedSearches)
      );
    }
  });