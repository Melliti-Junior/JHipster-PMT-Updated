package com.erp.app.web.rest.custom;

import com.codahale.metrics.annotation.Timed;
import com.erp.app.domain.custom.CustomStatus;
import com.erp.app.repository.custom.StatusCustomRepository;
import com.erp.app.repository.search.custom.StatusCustomSearchRepository;
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
public class StatusCustomResource {

	private final Logger log = LoggerFactory.getLogger(StatusCustomResource.class);

    private static final String ENTITY_NAME = "statuscustom";

    private final StatusCustomRepository statuscustomRepository;

    private final StatusCustomSearchRepository statuscustomSearchRepository;

    public StatusCustomResource(StatusCustomRepository statuscustomRepository, StatusCustomSearchRepository statuscustomSearchRepository) {
        this.statuscustomRepository = statuscustomRepository;
        this.statuscustomSearchRepository = statuscustomSearchRepository;
    }

    /**
     * POST  /statuscustoms : Create a new statuscustom.
     *
     * @param statuscustom the statuscustom to create
     * @return the ResponseEntity with status 201 (Created) and with body the new statuscustom, or with status 400 (Bad Request) if the statuscustom has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/statuscustoms")
    @Timed
    public ResponseEntity<CustomStatus> createStatusCustom(@Valid @RequestBody CustomStatus statuscustom) throws URISyntaxException {
        log.debug("REST request to save CustomStatus : {}", statuscustom);
        if (statuscustom.getId() != null) {
            throw new BadRequestAlertException("A new statuscustom cannot already have an ID", ENTITY_NAME, "idexists");
        }
        CustomStatus result = statuscustomRepository.save(statuscustom);
        statuscustomSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/custom/statuscustoms/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /statuscustoms : Updates an existing statuscustom.
     *
     * @param statuscustom the statuscustom to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated statuscustom,
     * or with status 400 (Bad Request) if the statuscustom is not valid,
     * or with status 500 (Internal Server Error) if the statuscustom couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/statuscustoms")
    @Timed
    public ResponseEntity<CustomStatus> updateStatusCustom(@Valid @RequestBody CustomStatus statuscustom) throws URISyntaxException {
        log.debug("REST request to update CustomStatus : {}", statuscustom);
        if (statuscustom.getId() == null) {
            return createStatusCustom(statuscustom);
        }
        CustomStatus result = statuscustomRepository.save(statuscustom);
        statuscustomSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, statuscustom.getId().toString()))
            .body(result);
    }

    /**
     * GET  /statuscustoms : get all the statuscustoms.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of statuscustoms in body
     */
    @GetMapping("/statuscustoms")
    @Timed
    public ResponseEntity<List<CustomStatus>> getAllStatusCustoms(Pageable pageable) {
        log.debug("REST request to get a page of StatusCustoms");
        Page<CustomStatus> page = statuscustomRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/custom/statuscustoms");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /statuscustoms/:id : get the "id" statuscustom.
     *
     * @param id the id of the statuscustom to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the statuscustom, or with status 404 (Not Found)
     */
    @GetMapping("/statuscustoms/{id}")
    @Timed
    public ResponseEntity<CustomStatus> getStatusCustom(@PathVariable String id) {
        log.debug("REST request to get CustomStatus : {}", id);
        CustomStatus statuscustom = statuscustomRepository.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(statuscustom));
    }

    /**
     * DELETE  /statuscustoms/:id : delete the "id" statuscustom.
     *
     * @param id the id of the statuscustom to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/statuscustoms/{id}")
    @Timed
    public ResponseEntity<Void> deleteStatusCustom(@PathVariable String id) {
        log.debug("REST request to delete CustomStatus : {}", id);
        statuscustomRepository.delete(id);
        statuscustomSearchRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id)).build();
    }

    /**
     * SEARCH  /_search/statuscustoms?query=:query : search for the statuscustom corresponding
     * to the query.
     *
     * @param query the query of the statuscustom search
     * @param pageable the pagination information
     * @return the result of the search
     */
    @GetMapping("/_search/statuscustoms")
    @Timed
    public ResponseEntity<List<CustomStatus>> searchStatusCustoms(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of StatusCustoms for query {}", query);
        Page<CustomStatus> page = statuscustomSearchRepository.search(queryStringQuery(query), pageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/custom/_search/statuscustoms");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }


}
