package com.erp.app.web.rest.custom;

import com.codahale.metrics.annotation.Timed;
import com.erp.app.domain.custom.SprintCustom;
import com.erp.app.repository.custom.SprintCustomRepository;
import com.erp.app.repository.search.custom.SprintCustomSearchRepository;
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
public class SprintCustomResource {

	private final Logger log = LoggerFactory.getLogger(SprintCustomResource.class);

    private static final String ENTITY_NAME = "sprintcustom";

    private final SprintCustomRepository sprintcustomRepository;

    private final SprintCustomSearchRepository sprintcustomSearchRepository;

    public SprintCustomResource(SprintCustomRepository sprintcustomRepository, SprintCustomSearchRepository sprintcustomSearchRepository) {
        this.sprintcustomRepository = sprintcustomRepository;
        this.sprintcustomSearchRepository = sprintcustomSearchRepository;
    }

    /**
     * POST  /sprintcustoms : Create a new sprintcustom.
     *
     * @param sprintcustom the sprintcustom to create
     * @return the ResponseEntity with status 201 (Created) and with body the new sprintcustom, or with status 400 (Bad Request) if the sprintcustom has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/sprintcustoms")
    @Timed
    public ResponseEntity<SprintCustom> createSprintCustom(@Valid @RequestBody SprintCustom sprintcustom) throws URISyntaxException {
        log.debug("REST request to save SprintCustom : {}", sprintcustom);
        if (sprintcustom.getId() != null) {
            throw new BadRequestAlertException("A new sprintcustom cannot already have an ID", ENTITY_NAME, "idexists");
        }
        SprintCustom result = sprintcustomRepository.save(sprintcustom);
        sprintcustomSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/custom/sprintcustoms/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /sprintcustoms : Updates an existing sprintcustom.
     *
     * @param sprintcustom the sprintcustom to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated sprintcustom,
     * or with status 400 (Bad Request) if the sprintcustom is not valid,
     * or with status 500 (Internal Server Error) if the sprintcustom couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/sprintcustoms")
    @Timed
    public ResponseEntity<SprintCustom> updateSprintCustom(@Valid @RequestBody SprintCustom sprintcustom) throws URISyntaxException {
        log.debug("REST request to update SprintCustom : {}", sprintcustom);
        if (sprintcustom.getId() == null) {
            return createSprintCustom(sprintcustom);
        }
        SprintCustom result = sprintcustomRepository.save(sprintcustom);
        sprintcustomSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, sprintcustom.getId().toString()))
            .body(result);
    }

    /**
     * GET  /sprintcustoms : get all the sprintcustoms.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of sprintcustoms in body
     */
    @GetMapping("/sprintcustoms")
    @Timed
    public ResponseEntity<List<SprintCustom>> getAllSprintCustoms(Pageable pageable) {
        log.debug("REST request to get a page of SprintCustoms");
        Page<SprintCustom> page = sprintcustomRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/custom/sprintcustoms");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /sprintcustoms/:id : get the "id" sprintcustom.
     *
     * @param id the id of the sprintcustom to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the sprintcustom, or with status 404 (Not Found)
     */
    @GetMapping("/sprintcustoms/{id}")
    @Timed
    public ResponseEntity<SprintCustom> getSprintCustom(@PathVariable String id) {
        log.debug("REST request to get SprintCustom : {}", id);
        SprintCustom sprintcustom = sprintcustomRepository.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(sprintcustom));
    }

    /**
     * DELETE  /sprintcustoms/:id : delete the "id" sprintcustom.
     *
     * @param id the id of the sprintcustom to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/sprintcustoms/{id}")
    @Timed
    public ResponseEntity<Void> deleteSprintCustom(@PathVariable String id) {
        log.debug("REST request to delete SprintCustom : {}", id);
        sprintcustomRepository.delete(id);
        sprintcustomSearchRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id)).build();
    }

    /**
     * SEARCH  /_search/sprintcustoms?query=:query : search for the sprintcustom corresponding
     * to the query.
     *
     * @param query the query of the sprintcustom search
     * @param pageable the pagination information
     * @return the result of the search
     */
    @GetMapping("/_search/sprintcustoms")
    @Timed
    public ResponseEntity<List<SprintCustom>> searchSprintCustoms(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of SprintCustoms for query {}", query);
        Page<SprintCustom> page = sprintcustomSearchRepository.search(queryStringQuery(query), pageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/custom/_search/sprintcustoms");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }


}
