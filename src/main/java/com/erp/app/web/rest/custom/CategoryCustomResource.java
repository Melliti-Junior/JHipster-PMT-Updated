package com.erp.app.web.rest.custom;

import com.codahale.metrics.annotation.Timed;
import com.erp.app.domain.custom.CustomCategory;
import com.erp.app.repository.custom.CategoryCustomRepository;
import com.erp.app.repository.search.custom.CategoryCustomSearchRepository;
import com.erp.app.web.rest.errors.BadRequestAlertException;
import com.erp.app.web.rest.util.HeaderUtil;
import com.erp.app.web.rest.util.PaginationUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;

@RestController
@RequestMapping("/api/custom")
public class CategoryCustomResource {

	private final Logger log = LoggerFactory.getLogger(CategoryCustomResource.class);

    private static final String ENTITY_NAME = "categorycustom";

    private final CategoryCustomRepository categorycustomRepository;

    private final CategoryCustomSearchRepository categorycustomSearchRepository;

    public CategoryCustomResource(CategoryCustomRepository categorycustomRepository, CategoryCustomSearchRepository categorycustomSearchRepository) {
        this.categorycustomRepository = categorycustomRepository;
        this.categorycustomSearchRepository = categorycustomSearchRepository;
    }

    /**
     * POST  /categorycustoms : Create a new categorycustom.
     *
     * @param categorycustom the categorycustom to create
     * @return the ResponseEntity with category 201 (Created) and with body the new categorycustom, or with category 400 (Bad Request) if the categorycustom has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/categorycustoms")
    @Timed
    public ResponseEntity<CustomCategory> createCategoryCustom(@Valid @RequestBody CustomCategory categorycustom) throws URISyntaxException {
        log.debug("REST request to save CustomCategory : {}", categorycustom);
        if (categorycustom.getId() != null) {
            throw new BadRequestAlertException("A new categorycustom cannot already have an ID", ENTITY_NAME, "idexists");
        }
        CustomCategory result = categorycustomRepository.save(categorycustom);
        categorycustomSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/custom/categorycustoms/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /categorycustoms : Updates an existing categorycustom.
     *
     * @param categorycustom the categorycustom to update
     * @return the ResponseEntity with category 200 (OK) and with body the updated categorycustom,
     * or with category 400 (Bad Request) if the categorycustom is not valid,
     * or with category 500 (Internal Server Error) if the categorycustom couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/categorycustoms")
    @Timed
    public ResponseEntity<CustomCategory> updateCategoryCustom(@Valid @RequestBody CustomCategory categorycustom) throws URISyntaxException {
        log.debug("REST request to update CustomCategory : {}", categorycustom);
        if (categorycustom.getId() == null) {
            return createCategoryCustom(categorycustom);
        }
        CustomCategory result = categorycustomRepository.save(categorycustom);
        categorycustomSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, categorycustom.getId().toString()))
            .body(result);
    }

    /**
     * GET  /categorycustoms : get all the categorycustoms.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with category 200 (OK) and the list of categorycustoms in body
     */
    @GetMapping("/categorycustoms")
    @Timed
    public ResponseEntity<List<CustomCategory>> getAllCategoryCustoms(Pageable pageable) {
        log.debug("REST request to get a page of CategoryCustoms");
        Page<CustomCategory> page = categorycustomRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/custom/categorycustoms");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /categorycustoms/:id : get the "id" categorycustom.
     *
     * @param id the id of the categorycustom to retrieve
     * @return the ResponseEntity with category 200 (OK) and with body the categorycustom, or with category 404 (Not Found)
     */
    @GetMapping("/categorycustoms/{id}")
    @Timed
    public ResponseEntity<CustomCategory> getCategoryCustom(@PathVariable String id) {
        log.debug("REST request to get CustomCategory : {}", id);
        CustomCategory categorycustom = categorycustomRepository.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(categorycustom));
    }

    /**
     * DELETE  /categorycustoms/:id : delete the "id" categorycustom.
     *
     * @param id the id of the categorycustom to delete
     * @return the ResponseEntity with category 200 (OK)
     */
    @DeleteMapping("/categorycustoms/{id}")
    @Timed
    public ResponseEntity<Void> deleteCategoryCustom(@PathVariable String id) {
        log.debug("REST request to delete CustomCategory : {}", id);
        categorycustomRepository.delete(id);
        categorycustomSearchRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id)).build();
    }

    /**
     * SEARCH  /_search/categorycustoms?query=:query : search for the categorycustom corresponding
     * to the query.
     *
     * @param query the query of the categorycustom search
     * @param pageable the pagination information
     * @return the result of the search
     */
    @GetMapping("/_search/categorycustoms")
    @Timed
    public ResponseEntity<List<CustomCategory>> searchCategoryCustoms(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of CategoryCustoms for query {}", query);
        Page<CustomCategory> page = categorycustomSearchRepository.search(queryStringQuery(query), pageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/custom/_search/categorycustoms");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }


}
