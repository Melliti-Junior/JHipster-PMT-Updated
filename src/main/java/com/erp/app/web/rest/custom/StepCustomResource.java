package com.erp.app.web.rest.custom;

import com.codahale.metrics.annotation.Timed;
import com.erp.app.domain.custom.StepCustom;
import com.erp.app.repository.custom.StepCustomRepository;
import com.erp.app.repository.search.custom.StepCustomSearchRepository;
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
public class StepCustomResource {

	private final Logger log = LoggerFactory.getLogger(StepCustomResource.class);

    private static final String ENTITY_NAME = "stepcustom";

    private final StepCustomRepository stepcustomRepository;

    private final StepCustomSearchRepository stepcustomSearchRepository;

    public StepCustomResource(StepCustomRepository stepcustomRepository, StepCustomSearchRepository stepcustomSearchRepository) {
        this.stepcustomRepository = stepcustomRepository;
        this.stepcustomSearchRepository = stepcustomSearchRepository;
    }

    /**
     * POST  /stepcustoms : Create a new stepcustom.
     *
     * @param stepcustom the stepcustom to create
     * @return the ResponseEntity with status 201 (Created) and with body the new stepcustom, or with status 400 (Bad Request) if the stepcustom has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/stepcustoms")
    @Timed
    public ResponseEntity<StepCustom> createStepCustom(@Valid @RequestBody StepCustom stepcustom) throws URISyntaxException {
        log.debug("REST request to save StepCustom : {}", stepcustom);
        if (stepcustom.getId() != null) {
            throw new BadRequestAlertException("A new stepcustom cannot already have an ID", ENTITY_NAME, "idexists");
        }
        StepCustom result = stepcustomRepository.save(stepcustom);
        stepcustomSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/custom/stepcustoms/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /stepcustoms : Updates an existing stepcustom.
     *
     * @param stepcustom the stepcustom to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated stepcustom,
     * or with status 400 (Bad Request) if the stepcustom is not valid,
     * or with status 500 (Internal Server Error) if the stepcustom couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/stepcustoms")
    @Timed
    public ResponseEntity<StepCustom> updateStepCustom(@Valid @RequestBody StepCustom stepcustom) throws URISyntaxException {
        log.debug("REST request to update StepCustom : {}", stepcustom);
        if (stepcustom.getId() == null) {
            return createStepCustom(stepcustom);
        }
        StepCustom result = stepcustomRepository.save(stepcustom);
        stepcustomSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, stepcustom.getId().toString()))
            .body(result);
    }

    /**
     * GET  /stepcustoms : get all the stepcustoms.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of stepcustoms in body
     */
    @GetMapping("/stepcustoms")
    @Timed
    public ResponseEntity<List<StepCustom>> getAllStepCustoms(Pageable pageable) {
        log.debug("REST request to get a page of StepCustoms");
        Page<StepCustom> page = stepcustomRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/custom/stepcustoms");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /stepcustoms/:id : get the "id" stepcustom.
     *
     * @param id the id of the stepcustom to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the stepcustom, or with status 404 (Not Found)
     */
    @GetMapping("/stepcustoms/{id}")
    @Timed
    public ResponseEntity<StepCustom> getStepCustom(@PathVariable String id) {
        log.debug("REST request to get StepCustom : {}", id);
        StepCustom stepcustom = stepcustomRepository.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(stepcustom));
    }

    /**
     * DELETE  /stepcustoms/:id : delete the "id" stepcustom.
     *
     * @param id the id of the stepcustom to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/stepcustoms/{id}")
    @Timed
    public ResponseEntity<Void> deleteStepCustom(@PathVariable String id) {
        log.debug("REST request to delete StepCustom : {}", id);
        stepcustomRepository.delete(id);
        stepcustomSearchRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id)).build();
    }

    /**
     * SEARCH  /_search/stepcustoms?query=:query : search for the stepcustom corresponding
     * to the query.
     *
     * @param query the query of the stepcustom search
     * @param pageable the pagination information
     * @return the result of the search
     */
    @GetMapping("/_search/stepcustoms")
    @Timed
    public ResponseEntity<List<StepCustom>> searchStepCustoms(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of StepCustoms for query {}", query);
        Page<StepCustom> page = stepcustomSearchRepository.search(queryStringQuery(query), pageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/custom/_search/stepcustoms");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }


}
