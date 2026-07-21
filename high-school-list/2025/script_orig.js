const u = async () => {
  try {
    const t = await fetch("https://fn5gl.t-mobile.com/api/verified-schools", {
      method: "get",
      headers: {
        Authorization: "Bearer jRB8Ger3aut7YN8I",
        "Content-Type": "application/json",
      },
    });
    if (!t.ok) throw new Error(`HTTP error! status: ${t.status}`);
    return await t.json();
  } catch {
    return false;
  }
};
function g(t, e) {
  u()
    .then((i) => {
      const a = i.sort((s, o) => (s.name.trim().toLowerCase() < o.name.trim().toLowerCase() ? -1 : 1));
      ((t.data = a), e([...t.data], t.currentPage, t.pageLimit));
    })
    .catch((i) => {
      e("An error occurred. Please try again later.");
    });
}
function l(t, e, i) {
  const a = window.npi.querySelector(".tsw-table_list");
  if (!Array.isArray(t)) {
    a.textContent = t;
    return;
  }
  if (!t.length) {
    a.textContent = "No schools yet. Please check back later.";
    return;
  }
  const s = [],
    o = e * i - i,
    n = o + i;
  (t.slice(o, n).forEach((d, r) => {
    if (d.id) {
      const h = `<div class="tsw-table_row">
          <div class="tsw-table_row-name">${d.name}</div>
          <div class="tsw-table_row-city">${d.city}</div>
          <div class="tsw-table_row-state">${d.state}</div>
          <div class="tsw-table_row-site"><a target="_blank" href="${d.school_website}">School website </a></div>
          </div>`;
      s.push(h);
    }
  }),
    (a.innerHTML = s.join("")));
}
function p() {
  const t = window.npi.querySelector(".tsw-table_list");
  t.innerHTML = "";
}
function m() {
  return {
    model: null,
    init(t) {
      ((this.pagination = window.npi.querySelector(".tsw-pagination")),
        (this.paginationDigits = this.pagination.querySelectorAll(".tsw-pagination_digit")),
        (this.prevBtn = this.pagination.querySelector(".tsw-pagination_btn--previous")),
        (this.nextBtn = this.pagination.querySelector(".tsw-pagination_btn--next")),
        this.pagination &&
          (this.registerEventListeners(),
          (this.model = t),
          this.setData(this.model.data)
            .then(() => {
              this.setPaginationView();
            })
            .catch((e) => {
              console.log("Data no loaded", e);
            })));
    },
    registerEventListeners() {
      (this.nextBtn.addEventListener("click", this.setNextPage.bind(this)),
        this.prevBtn.addEventListener("click", this.setPreviousPage.bind(this)));
    },
    setNextPage(t) {
      t.preventDefault();
      const e = this.model.currentPage,
        i = this.model.filteredData.length > 0 ? this.model.filteredData : this.model.data,
        a = Math.round(i.length / this.model.pageLimit);
      if (e <= a) {
        const s = this.model.currentPage + 1;
        (this.model.updatePageNumber(s), this.setPaginationView());
      }
    },
    setPreviousPage(t) {
      if ((t.preventDefault(), this.model.currentPage > 1)) {
        const i = this.model.currentPage - 1;
        (this.model.updatePageNumber(i), this.setPaginationView());
      }
    },
    setPaginationView(t) {
      this.clearActiveStatus();
      const [e, i, a, s, o] = this.paginationDigits,
        n = this.model.currentPage;
      this.model.direction;
      const c = this.model.paginationDigits,
        d =
          this.model.filteredData === void 0 || !this.model.filteredData.length
            ? this.model.data
            : this.model.filteredData,
        r = t === void 0 ? Math.ceil(d.length / this.model.pageLimit) : 1;
      if (
        ((e.textContent = 1),
        (i.textContent = 2),
        (a.textContent = 3),
        (o.textContent = r),
        r <= c &&
          (r === c &&
            ((e.textContent = 1),
            (i.textContent = 2),
            (a.textContent = 3),
            s.classList.add("hidden"),
            o.classList.add("hidden")),
          r <= c - 1 &&
            ((e.textContent = 1),
            (i.textContent = 2),
            a.classList.add("hidden"),
            s.classList.add("hidden"),
            o.classList.add("hidden")),
          r <= c - 2 &&
            ((e.textContent = 1),
            i.classList.add("hidden"),
            a.classList.add("hidden"),
            s.classList.add("hidden"),
            o.classList.add("hidden")),
          this.paginationDigits.forEach((h) => {
            parseInt(h.textContent) === n && h.classList.add("active");
          })),
        r > c &&
          ((e.textContent = n),
          (i.textContent = n + 1),
          (a.textContent = n + 2),
          e.classList.add("active"),
          n >= r - 3 &&
            (e.classList.remove("active"),
            (e.textContent = r - c),
            (i.textContent = r - c + 1),
            (a.textContent = r - c + 2),
            this.paginationDigits.forEach((h) => {
              parseInt(h.textContent) === n && h.classList.add("active");
            }))),
        this.setPaginationNavigation(),
        this.model.currentPage === 1 && r == 0)
      ) {
        (this.prevBtn.classList.add("tsw-disabled"), this.nextBtn.classList.add("tsw-disabled"));
        return;
      }
      (this.model.currentPage === 1
        ? this.prevBtn.classList.add("tsw-disabled")
        : this.prevBtn.classList.remove("tsw-disabled"),
        this.model.currentPage === r
          ? this.nextBtn.classList.add("tsw-disabled")
          : this.nextBtn.classList.remove("tsw-disabled"));
    },
    setPaginationNavigation() {
      (this.pagination.querySelector("tsw-pagination_btn--previous"),
        this.pagination.querySelector("tsw-pagination_btn--next"),
        this.model.filteredData === void 0 || !this.model.filteredData.length
          ? this.model.data
          : this.model.filteredData);
    },
    clearActiveStatus() {
      this.paginationDigits.forEach((t) => {
        (t.classList.remove("hidden"), t.classList.remove("active"));
      });
    },
    setData(t) {
      return new Promise((e, i) => {
        setTimeout(() => {
          t ? e(t) : i("Data has not be set");
        }, 500);
      });
    },
  };
}
function f() {
  return {
    model: null,
    paginationView: null,
    init(t, e) {
      ((this.searchContainer = window.npi.querySelector(".tsw-input_group")),
        (this.searchBoxInput = this.searchContainer.querySelector(".tsw-input")),
        (this.searchBoxResetBtn = this.searchContainer.querySelector(".tsw-input_btn--reset")),
        (this.searchBoxBtn = window.npi.querySelector(".tsw-btn_submit")),
        this.searchContainer && ((this.model = t), (this.paginationView = e), this.registerListeners()));
    },
    registerListeners() {
      (this.searchBoxInput.addEventListener("keyup", this.handleSearchInput.bind(this)),
        this.searchBoxResetBtn.addEventListener("click", this.handleInputClear.bind(this)),
        this.searchBoxBtn.addEventListener("click", this.handleSearch.bind(this)));
    },
    handleSearchInput(t) {
      const e = t.target.parentNode;
      (t.target.value.length > 0 && (this.setSearchActive(e), this.updateSearchTerm(t.target.value)),
        t.target.value.length === 0 &&
          e.classList.contains("active") &&
          (this.resetSearch(e),
          this.model.resetFilteredData(),
          this.model.updatePageNumber(1),
          this.updatePaginationView()));
    },
    handleInputClear(t) {
      const e = t.target.parentNode;
      (this.clearSearchView(),
        this.model.resetFilteredData(),
        this.model.updatePageNumber(1),
        this.updatePaginationView(),
        this.resetSearch(e));
    },
    handleSearch(t) {
      (t.preventDefault(), this.searchData());
    },
    setSearchActive(t) {
      (t.classList.add("active"),
        this.searchBoxResetBtn.setAttribute("tabindex", "0"),
        this.searchBoxResetBtn.setAttribute("aria-hidden", false));
    },
    resetSearch(t) {
      (t.classList.remove("active"),
        this.searchBoxResetBtn.setAttribute("tabindex", "-1"),
        this.searchBoxResetBtn.setAttribute("aria-hidden", true));
    },
    updateSearchTerm(t) {
      this.model.searchTerm = t.toLowerCase();
    },
    clearSearchView() {
      this.searchBoxInput.value = "";
    },
    searchData() {
      const t = [];
      if (
        (this.model.data.filter((e) => {
          e.name.trim().toLowerCase().includes(this.model.searchTerm) && t.push(e);
        }),
        !t.length)
      ) {
        (this.model.noSearchResult("No search result found."), this.updatePaginationView(1));
        return;
      }
      ((this.model.filteredData = [...t]), this.model.updatePageNumber(1), this.updatePaginationView());
    },
    updatePaginationView(t) {
      this.paginationView.setPaginationView(t);
    },
  };
}
function v() {
  window.npi.querySelectorAll(".tsw-hashtag_container").forEach((e) => {
    const i = (s, o) => {
      const n = { root: null, rootMargin: "0px", threshold: 0.4 };
      new IntersectionObserver((d, r) => a(d, r), n).observe(s);
    };
    function a(s, o) {
      const n = s[0].target;
      s[0].isIntersecting ? n.classList.add("active") : n.classList.contains("acitve") && o.unobserve(n);
    }
    i(e);
  });
}
function w(t) {
  return {
    activeSearch: false,
    currentPage: 1,
    data: [],
    direction: null,
    filteredData: [],
    pageLimit: 100,
    paginationDigits: 3,
    searchTerm: "",
    resetFilteredData() {
      ((this.searchTerm = ""), (this.filteredData = []));
    },
    noSearchResult(e) {
      t(e);
    },
    updatePageNumber(e) {
      (this.currentPage < e ? (this.direction = "up") : (this.direction = "down"), (this.currentPage = e));
      const i = this.filteredData.length > 0 ? this.filteredData : this.data;
      t(i);
    },
  };
}
document.addEventListener("DOMContentLoaded", () => {
  const t = m(),
    e = f(),
    i = w(a);
  (g(i, l), t.init(i), e.init(i, t), v());
  function a(s) {
    const { data: o, currentPage: n, pageLimit: c } = i;
    (p(), l(s, n, c));
  }
});
