package com.erp.app.web.rest.custom;

import com.codahale.metrics.annotation.Timed;
import com.erp.app.domain.custom.TransitionCustom;
import com.erp.app.repository.custom.TransitionCustomRepository;
import com.erp.app.repository.search.custom.TransitionCustomSearchRepository;
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
public class TransitionCustomResource {

	private final Logger log = LoggerFactory.getLogger(TransitionCustomResource.class);

    private static final String ENTITY_NAME = "transitioncustom";

    private final TransitionCustomRepository transitioncustomRepository;

    private final TransitionCustomSearchRepository transitioncustomSearchRepository;

    public TransitionCustomResource(TransitionCustomRepository transitioncustomRepository, TransitionCustomSearchRepository transitioncustomSearchRepository) {
        this.transitioncustomRepository = transitioncustomRepository;
        this.transitioncustomSearchRepository = transitioncustomSearchRepository;
    }

    /**
     * POST  /transitioncustoms : Create a new transitioncustom.
     *
     * @param transitioncustom the transitioncustom to create
     * @return the ResponseEntity with status 201 (Created) and with body the new transitioncustom, or with status 400 (Bad Request) if the transitioncustom has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/transitioncustoms")
    @Timed
    public ResponseEntity<TransitionCustom> createTransitionCustom(@Valid @RequestBody TransitionCustom transitioncustom) throws URISyntaxException {
        log.debug("REST request to save TransitionCustom : {}", transitioncustom);
        if (transitioncustom.getId() != null) {
            throw new BadRequestAlertException("A new transitioncustom cannot already have an ID", ENTITY_NAME, "idexists");
        }
        TransitionCustom result = transitioncustomRepository.save(transitioncustom);
        transitioncustomSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/custom/transitioncustoms/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /transitioncustoms : Updates an existing transitioncustom.
     *
     * @param transitioncustom the transitioncustom to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated transitioncustom,
     * or with status 400 (Bad Request) if the transitioncustom is not valid,
     * or with status 500 (Internal Server Error) if the transitioncustom couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/transitioncustoms")
    @Timed
    public ResponseEntity<TransitionCustom> updateTransitionCustom(@Valid @RequestBody TransitionCustom transitioncustom) throws URISyntaxException {
        log.debug("REST request to update TransitionCustom : {}", transitioncustom);
        if (transitioncustom.getId() == null) {
            return createTransitionCustom(transitioncustom);
        }
        TransitionCustom result = transitioncustomRepository.save(transitioncustom);
        transitioncustomSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, transitioncustom.getId().toString()))
            .body(result);
    }

    /**
     * GET  /transitioncustoms : get all the transitioncustoms.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of transitioncustoms in body
     */
    @GetMapping("/transitioncustoms")
    @Timed
    public ResponseEntity<List<TransitionCustom>> getAllTransitionCustoms(Pageable pageable) {
        log.debug("REST request to get a page of TransitionCustoms");
        Page<TransitionCustom> page = transitioncustomRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/custom/transitioncustoms");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /transitioncustoms/:id : get the "id" transitioncustom.
     *
     * @param id the id of the transitioncustom to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the transitioncustom, or with status 404 (Not Found)
     */
    @GetMapping("/transitioncustoms/{id}")
    @Timed
    public ResponseEntity<TransitionCustom> getTransitionCustom(@PathVariable String id) {
        log.debug("REST request to get TransitionCustom : {}", id);
        TransitionCustom transitioncustom = transitioncustomRepository.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(transitioncustom));
    }

    /**
     * DELETE  /transitioncustoms/:id : delete the "id" transitioncustom.
     *
     * @param id the id of the transitioncustom to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/transitioncustoms/{id}")
    @Timed
    public ResponseEntity<Void> deleteTransitionCustom(@PathVariable String id) {
        log.debug("REST request to delete TransitionCustom : {}", id);
        transitioncustomRepository.delete(id);
        transitioncustomSearchRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id)).build();
    }

    /**
     * SEARCH  /_search/transitioncustoms?query=:query : search for the transitioncustom corresponding
     * to the query.
     *
     * @param query the query of the transitioncustom search
     * @param pageable the pagination information
     * @return the result of the search
     */
    @GetMapping("/_search/transitioncustoms")
    @Timed
    public ResponseEntity<List<TransitionCustom>> searchTransitionCustoms(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of TransitionCustoms for query {}", query);
        Page<TransitionCustom> page = transitioncustomSearchRepository.search(queryStringQuery(query), pageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/custom/_search/transitioncustoms");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }


}
